import { concat, EMPTY, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { adminUsersActions } from '@bgap/admin/shared/data-access/admin-users';
import { chainsActions } from '@bgap/admin/shared/data-access/chains';
import { dashboardActions } from '@bgap/admin/shared/data-access/dashboard';
import { groupsActions } from '@bgap/admin/shared/data-access/groups';
import {
  loggedUserActions,
  loggedUserSelectors,
} from '@bgap/admin/shared/data-access/logged-user';
import { ordersActions } from '@bgap/admin/shared/data-access/orders';
import { productCategoriesActions } from '@bgap/admin/shared/data-access/product-categories';
import { productComponentSetsActions } from '@bgap/admin/shared/data-access/product-component-sets';
import { productComponentsActions } from '@bgap/admin/shared/data-access/product-components';
import { productsActions } from '@bgap/admin/shared/data-access/products';
import { roleContextActions } from '@bgap/admin/shared/data-access/role-contexts';
import { unitsActions } from '@bgap/admin/shared/data-access/units';
import { usersActions } from '@bgap/admin/shared/data-access/users';
import { DEFAULT_LANG } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { filterNullish, filterNullishElements } from '@bgap/shared/utils';
import { select, Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { TranslateService } from '@ngx-translate/core';

import { AnyuppSdkService } from '../anyupp-sdk.service';
import { CrudSdkService } from '../crud-sdk.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private _destroyConnection$: Subject<boolean> = new Subject<boolean>();
  private _settingsChanged$: Subject<boolean> = new Subject<boolean>();
  private _rolesChanged$: Subject<boolean> = new Subject<boolean>();
  private _dataConnectionInitialized = false;

  constructor(
    private _store: Store,
    private _translateService: TranslateService,
    private crudSdk: CrudSdkService,
    private anyuppSdk: AnyuppSdkService,
  ) {}

  public async initDataConnections(
    userId: string,
    role: CrudApi.Role,
  ): Promise<void> {
    // Prevent multiple initialization on login
    if (this._dataConnectionInitialized) return;

    concat(
      this.crudSdk.sdk.GetAdminUser({ id: userId }),
      this.crudSdk.sdk.OnAdminUserChange({ id: userId }),
    )
      .pipe(
        takeUntil(this._destroyConnection$),
        filterNullish(),
        tap(loggedUser => {
          this._store.dispatch(
            loggedUserActions.loadLoggedUserSuccess({
              loggedUser,
            }),
          );
          this._store.dispatch(
            loggedUserActions.setLoggedUserRole({
              role,
            }),
          );
        }),
      )
      .subscribe();

    this._store
      .pipe(
        select(loggedUserSelectors.getLoggedUserSettings),
        //  filterNullish(),
        distinctUntilChanged(
          (prev, curr): boolean =>
            prev?.selectedChainId === curr?.selectedChainId &&
            prev?.selectedGroupId === curr?.selectedGroupId &&
            prev?.selectedUnitId === curr?.selectedUnitId,
        ),
        takeUntil(this._destroyConnection$),
      )
      .subscribe(
        (
          adminUserSettings: CrudApi.AdminUserSettings | undefined | null,
        ): void => {
          console.error('adminUserSettings CHANGED', adminUserSettings);
          this._settingsChanged$.next(true);

          this._subscribeToChainProductCategories(
            adminUserSettings?.selectedChainId || '',
          );
          this._subscribeToChainProductComponents(
            adminUserSettings?.selectedChainId || '',
          );
          this._subscribeToChainProductComponentSets(
            adminUserSettings?.selectedChainId || '',
          );
          this._subscribeToSelectedChainProducts(
            adminUserSettings?.selectedChainId || '',
          );
          this._subscribeToSelectedGroupProducts(
            adminUserSettings?.selectedGroupId || '',
          );
          this._subscribeToSelectedUnitProducts(
            adminUserSettings?.selectedUnitId || '',
          );
          this._subscribeToGeneratedUnitProducts(
            adminUserSettings?.selectedUnitId || '',
          );
          this._subscribeToSelectedUnitOrders(
            adminUserSettings?.selectedUnitId || '',
          );
        },
      );

    // Lists
    this._subscribeToRoleContext();
    this._subscribeToChains();
    this._subscribeToGroups();
    this._subscribeToUnits();
    this._subscribeToAdminUsers();
    this._subscribeToAdminRoleContexts();

    // Get user language
    this._store
      .pipe(
        select(loggedUserSelectors.getSelectedLanguage),
        takeUntil(this._destroyConnection$),
      )
      .subscribe((selectedLanguage: string | undefined | null): void => {
        const lang = selectedLanguage || DEFAULT_LANG;
        this._translateService.use(lang);
        localStorage.setItem('selectedLanguage', lang);
      });

    this._dataConnectionInitialized = true;
  }

  private _subscribeToRoleContext(): void {
    this._store.dispatch(roleContextActions.resetRoleContexts());

    concat(
      this.crudSdk.sdk.ListRoleContexts().pipe(
        filterNullish(),
        map(result => result.items),
      ),
      this.crudSdk.sdk.OnRoleContextsChange().pipe(
        filterNullish(),
        map(context => [context]),
      ),
    )
      .pipe(
        filterNullishElements<CrudApi.RoleContext>(),
        tap(roleContexts =>
          this._store.dispatch(
            roleContextActions.upsertRoleContexts({
              roleContexts,
            }),
          ),
        ),
        takeUntil(this._destroyConnection$),
      )
      .subscribe();
  }

  private _doSubscription<T>(
    resetAction: TypedAction<string> | undefined,
    listOp: Observable<
      | { items?: Array<T | undefined | null> | undefined | null }
      | undefined
      | null
    >,
    subscriptionOp: Observable<T | null | undefined>,
    upsertActionCreator: (items: T[]) => TypedAction<string>,
  ) {
    if (resetAction) {
      this._store.dispatch(resetAction);
    }
    concat(
      listOp.pipe(
        tap(list => console.error('list?', list?.items)),
        filterNullish(),
        map(list => list.items),
      ),
      subscriptionOp.pipe(
        filterNullish(),
        map(item => [item]),
      ),
    )
      .pipe(
        filterNullishElements(),
        tap(items => this._store.dispatch(upsertActionCreator(items))),
        takeUntil(this._destroyConnection$),
        catchError(err => {
          console.error('ERROR', err);
          return of(EMPTY); /*TODO error actio > effect > toaster */
        }),
      )
      .subscribe();
  }

  private _subscribeToChains(): void {
    this._doSubscription(
      chainsActions.resetChains(),
      this.crudSdk.sdk.ListChains(),
      this.crudSdk.sdk.OnChainsChange(),
      (chains: CrudApi.Chain[]) => chainsActions.upsertChains({ chains }),
    );
  }

  private _subscribeToGroups(): void {
    this._doSubscription(
      groupsActions.resetGroups(),
      this.crudSdk.sdk.ListGroups(),
      this.crudSdk.sdk.OnGroupsChange(),
      (groups: CrudApi.Group[]) => groupsActions.upsertGroups({ groups }),
    );
  }

  private _subscribeToUnits(): void {
    this._doSubscription(
      unitsActions.resetUnits(),
      this.crudSdk.sdk.ListUnits(),
      this.crudSdk.sdk.OnUnitsChange(),
      (units: CrudApi.Unit[]) => unitsActions.upsertUnits({ units }),
    );
  }

  private _subscribeToChainProductCategories(chainId: string): void {
    this._doSubscription(
      productCategoriesActions.resetProductCategories(),
      this.crudSdk.sdk.ListProductCategorys({
        filter: { chainId: { eq: chainId } },
      }),
      this.crudSdk.sdk.OnProductCategoriesChange(),
      (productCategorys: CrudApi.ProductCategory[]) =>
        productCategoriesActions.upsertProductCategorys({ productCategorys }),
    );
  }

  private _subscribeToChainProductComponents(chainId: string): void {
    this._doSubscription(
      productComponentsActions.resetProductComponents(),

      this.crudSdk.sdk.ListProductComponents({
        filter: { chainId: { eq: chainId } },
      }),
      this.crudSdk.sdk.OnProductComponentsChange(),
      (productComponents: CrudApi.ProductComponent[]) =>
        productComponentsActions.upsertProductComponents({ productComponents }),
    );
  }

  private _subscribeToChainProductComponentSets(chainId: string): void {
    this._doSubscription(
      productComponentSetsActions.resetProductComponentSets(),

      this.crudSdk.sdk.ListProductComponentSets({
        filter: { chainId: { eq: chainId } },
      }),
      this.crudSdk.sdk.OnProductComponentSetsChange(),
      (productComponentSets: CrudApi.ProductComponentSet[]) =>
        productComponentSetsActions.upsertProductComponentSets({
          productComponentSets,
        }),
    );
  }

  private _subscribeToSelectedChainProducts(chainId: string): void {
    this._doSubscription(
      productsActions.resetChainProducts(),

      this.crudSdk.sdk.ListChainProducts({
        filter: { chainId: { eq: chainId } },
      }),
      this.crudSdk.sdk.OnChainProductChange(),
      (products: CrudApi.ChainProduct[]) =>
        productsActions.upsertChainsProducts({ products }),
    );
  }

  private _subscribeToSelectedGroupProducts(groupId: string): void {
    // TODO: eliminate the any
    // There must be a confusion in the schema, eliminate it pls
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this._doSubscription<any>(
      productsActions.resetGroupProducts(),

      this.crudSdk.sdk.ListGroupProducts({
        filter: { groupId: { eq: groupId } },
      }),
      this.crudSdk.sdk.OnGroupProductChange(),
      (products: CrudApi.GroupProduct[]) =>
        productsActions.upsertGroupProducts({ products }),
    );
  }

  private _subscribeToSelectedUnitProducts(unitId: string): void {
    this._doSubscription(
      productsActions.resetUnitProducts(),

      this.crudSdk.sdk.ListUnitProducts({
        filter: { unitId: { eq: unitId } },
      }),
      this.crudSdk.sdk.OnUnitProductChange(),
      (products: CrudApi.UnitProduct[]) =>
        productsActions.upsertUnitProducts({ products }),
    );
  }

  private _subscribeToGeneratedUnitProducts(unitId: string): void {
    this._doSubscription<any>(
      productsActions.resetGeneratedProducts(),

      this.crudSdk.sdk.ListGeneratedProducts({
        filter: { unitId: { eq: unitId } },
      }),
      this.crudSdk.sdk.OnGeneratedProductChange(),
      (products: CrudApi.GeneratedProduct[]) =>
        productsActions.upsertGeneratedProducts({ products }),
    );
  }

  private _subscribeToSelectedUnitOrders(unitId: string): void {
    console.error('_subscribeToSelectedUnitOrders', unitId);
    this._doSubscription<any>(
      ordersActions.resetActiveOrders(),

      this.crudSdk.sdk.ListOrders(),
      this.crudSdk.sdk.OnOrdersChange(),
      (orders: CrudApi.Order[]) => {
        console.error('unit orders', orders);
        return ordersActions.upsertActiveOrders({ orders });
      },
    );

    /*
    this._store
      .pipe(
        select(dashboardSelectors.getSelectedHistoryDate),
        tap(() => {
          this._store.dispatch(
            ordersActions.setAllHistoryOrders({
              orders: [],
            }),
          );
        }),
        switchMap((historyDate: number) => {
          const dayIntervals: IDateIntervals = getDayIntervals(historyDate);
          return this._angularFireDatabase
            .list(`/orders/chains/${chainId}/units/${unitId}/history`, ref =>
              ref
                .orderByChild('created')
                .startAt(dayIntervals.from)
                .endAt(dayIntervals.to),
            )
            .stateChanges();
        }),
        takeUntil(this._settingsChanged$),
      )
      .subscribe((data): void => {
        if (data.type === EFirebaseStateEvent.CHILD_REMOVED) {
          this._store.dispatch(
            ordersActions.removeHistoryOrder({
              orderId: data.key || '',
            }),
          );
        } else {
          this._store.dispatch(
            ordersActions.upsertHistoryOrder({
              order: {
                ...(<IOrder>data.payload.val()),
                id: data.key || '',
              },
            }),
          );
        }
      });*/
  }

  private _subscribeToAdminUsers(): void {
    this._doSubscription(
      adminUsersActions.resetAdminUsers(),

      this.crudSdk.sdk.ListAdminUsers(),
      this.crudSdk.sdk.OnAdminUsersChange(),
      (adminUsers: CrudApi.AdminUser[]) =>
        adminUsersActions.upsertAdminUsers({ adminUsers }),
    );
  }

  private _subscribeToAdminRoleContexts(): void {
    this.crudSdk.sdk
      .OnAdminRoleContextsChange()
      .pipe(
        takeUntil(this._destroyConnection$),
        filterNullish(),
        switchMap(data =>
          this.crudSdk.sdk.GetAdminUser({ id: data.adminUserId }),
        ),
        filterNullish(),
        tap(adminUser =>
          this._store.dispatch(
            adminUsersActions.upsertAdminUsers({
              adminUsers: [adminUser],
            }),
          ),
        ),
      )
      .subscribe();
  }

  public destroyDataConnection(): void {
    // We have to destroy the subscriptions on logout
    this._destroyConnection$.next(true);
    this._settingsChanged$.next(true);
    this._rolesChanged$.next(true);

    // Clear store
    this._store.dispatch(chainsActions.resetChains());
    this._store.dispatch(groupsActions.resetGroups());
    this._store.dispatch(unitsActions.resetUnits());
    this._store.dispatch(usersActions.resetUsers());
    this._store.dispatch(adminUsersActions.resetAdminUsers());
    this._store.dispatch(productCategoriesActions.resetProductCategories());
    this._store.dispatch(ordersActions.resetActiveOrders());
    this._store.dispatch(ordersActions.resetHistoryOrders());
    this._store.dispatch(productsActions.resetChainProducts());
    this._store.dispatch(productsActions.resetGroupProducts());
    this._store.dispatch(productsActions.resetUnitProducts());
    this._store.dispatch(productsActions.resetGeneratedProducts());
    this._store.dispatch(loggedUserActions.resetLoggedUser());
    this._store.dispatch(dashboardActions.resetDashboard());

    this._dataConnectionInitialized = false;
  }

  //
  // Unit
  //

  public updateUnit(
    unit: CrudApi.UpdateUnitInput,
  ): Observable<CrudApi.Unit | undefined | null> {
    return this.crudSdk.sdk.UpdateUnit({ input: unit });
  }

  public regenerateUnitData(unitId: string) {
    return this.anyuppSdk.sdk.RegenerateUnitData({ input: { id: unitId } });
  }

  public updateAdminUserSettings(
    userId: string,
    settings: CrudApi.UpdateAdminUserInput['settings'],
  ) {
    return this.crudSdk.sdk.UpdateAdminUser({
      input: {
        id: userId,
        settings,
      },
    });
  }
}
