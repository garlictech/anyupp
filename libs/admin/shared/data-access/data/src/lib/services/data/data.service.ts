import { concat, Observable, Subject } from 'rxjs';
import {
  distinctUntilChanged,
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
import {
  AnyuppSdkService,
  CrudSdkService,
} from '@bgap/admin/shared/data-access/sdk';
import { unitsActions } from '@bgap/admin/shared/data-access/units';
import { usersActions } from '@bgap/admin/shared/data-access/users';
import { catchGqlError, DEFAULT_LANG } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { filterNullish, filterNullishElements } from '@bgap/shared/utils';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

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
    private _crudSdk: CrudSdkService,
    private _anyuppSdk: AnyuppSdkService,
  ) {}

  public async initDataConnections(
    userId: string,
    role: CrudApi.Role,
  ): Promise<void> {
    // Prevent multiple initialization on login
    if (this._dataConnectionInitialized) return;

    concat(
      this._crudSdk.sdk.GetAdminUser({ id: userId }),
      this._crudSdk.sdk.OnAdminUserChange({ id: userId }),
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
        catchGqlError(this._store),
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
          this._settingsChanged$.next(true);

          if (adminUserSettings?.selectedChainId) {
            this._subscribeToChainProductCategories(
              adminUserSettings?.selectedChainId,
            );
            this._subscribeToChainProductComponents(
              adminUserSettings?.selectedChainId,
            );
            this._subscribeToChainProductComponentSets(
              adminUserSettings?.selectedChainId,
            );
            this._subscribeToSelectedChainProducts(
              adminUserSettings?.selectedChainId,
            );
          }

          if (adminUserSettings?.selectedGroupId) {
            this._subscribeToSelectedGroupProducts(
              adminUserSettings?.selectedGroupId,
            );
          }

          if (adminUserSettings?.selectedUnitId) {
            this._subscribeToSelectedUnitProducts(
              adminUserSettings?.selectedUnitId,
            );
            this._subscribeToGeneratedUnitProducts(
              adminUserSettings?.selectedUnitId,
            );
            this._subscribeToSelectedUnitOrders(
              adminUserSettings?.selectedUnitId,
            );
          }
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
      this._crudSdk.sdk.ListRoleContexts().pipe(
        filterNullish(),
        map(result => result.items),
      ),
      this._crudSdk.sdk.OnRoleContextsChange().pipe(
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
        catchGqlError(this._store),
        takeUntil(this._destroyConnection$),
      )
      .subscribe();
  }

  private _subscribeToChains(): void {
    this._crudSdk.doListSubscription(
      chainsActions.resetChains(),
      this._crudSdk.sdk.ListChains(),
      this._crudSdk.sdk.OnChainsChange(),
      (chains: CrudApi.Chain[]) => chainsActions.upsertChains({ chains }),
      this._destroyConnection$,
    );
  }

  private _subscribeToGroups(): void {
    this._crudSdk.doListSubscription(
      groupsActions.resetGroups(),
      this._crudSdk.sdk.ListGroups(),
      this._crudSdk.sdk.OnGroupsChange(),
      (groups: CrudApi.Group[]) => groupsActions.upsertGroups({ groups }),
      this._destroyConnection$,
    );
  }

  private _subscribeToUnits(): void {
    this._crudSdk.doListSubscription(
      unitsActions.resetUnits(),
      this._crudSdk.sdk.ListUnits(),
      this._crudSdk.sdk.OnUnitsChange(),
      (units: CrudApi.Unit[]) => unitsActions.upsertUnits({ units }),
      this._destroyConnection$,
    );
  }

  private _subscribeToChainProductCategories(chainId: string): void {
    this._crudSdk.doListSubscription(
      productCategoriesActions.resetProductCategories(),
      this._crudSdk.sdk.ListProductCategorys({
        filter: { chainId: { eq: chainId } },
      }),
      this._crudSdk.sdk.OnProductCategoriesChange(),
      (productCategorys: CrudApi.ProductCategory[]) =>
        productCategoriesActions.upsertProductCategorys({ productCategorys }),
      this._settingsChanged$,
    );
  }

  private _subscribeToChainProductComponents(chainId: string): void {
    this._crudSdk.doListSubscription(
      productComponentsActions.resetProductComponents(),

      this._crudSdk.sdk.ListProductComponents({
        filter: { chainId: { eq: chainId } },
      }),
      this._crudSdk.sdk.OnProductComponentsChange(),
      (productComponents: CrudApi.ProductComponent[]) =>
        productComponentsActions.upsertProductComponents({ productComponents }),
      this._settingsChanged$,
    );
  }

  private _subscribeToChainProductComponentSets(chainId: string): void {
    this._crudSdk.doListSubscription(
      productComponentSetsActions.resetProductComponentSets(),

      this._crudSdk.sdk.ListProductComponentSets({
        filter: { chainId: { eq: chainId } },
      }),
      this._crudSdk.sdk.OnProductComponentSetsChange(),
      (productComponentSets: CrudApi.ProductComponentSet[]) =>
        productComponentSetsActions.upsertProductComponentSets({
          productComponentSets,
        }),
      this._settingsChanged$,
    );
  }

  private _subscribeToSelectedChainProducts(chainId: string): void {
    this._crudSdk.doListSubscription(
      productsActions.resetChainProducts(),

      this._crudSdk.sdk.ListChainProducts({
        filter: { chainId: { eq: chainId } },
      }),
      this._crudSdk.sdk.OnChainProductChange(),
      (products: CrudApi.ChainProduct[]) =>
        productsActions.upsertChainsProducts({ products }),
      this._settingsChanged$,
    );
  }

  private _subscribeToSelectedGroupProducts(groupId: string): void {
    this._crudSdk.doListSubscription(
      productsActions.resetGroupProducts(),

      this._crudSdk.sdk.ListGroupProducts({
        filter: { groupId: { eq: groupId } },
      }),
      this._crudSdk.sdk.OnGroupProductChange(),
      (products: CrudApi.GroupProduct[]) =>
        productsActions.upsertGroupProducts({ products }),
      this._settingsChanged$,
    );
  }

  private _subscribeToSelectedUnitProducts(unitId: string): void {
    this._crudSdk.doListSubscription(
      productsActions.resetUnitProducts(),

      this._crudSdk.sdk.ListUnitProducts({
        filter: { unitId: { eq: unitId } },
      }),
      this._crudSdk.sdk.OnUnitProductChange(),
      (products: CrudApi.UnitProduct[]) =>
        productsActions.upsertUnitProducts({ products }),
      this._settingsChanged$,
    );
  }

  private _subscribeToGeneratedUnitProducts(unitId: string): void {
    this._crudSdk.doListSubscription(
      productsActions.resetGeneratedProducts(),

      this._crudSdk.sdk.ListGeneratedProducts({
        filter: { unitId: { eq: unitId } },
      }),
      this._crudSdk.sdk.OnGeneratedProductChange(),
      (products: CrudApi.GeneratedProduct[]) =>
        productsActions.upsertGeneratedProducts({ products }),
      this._settingsChanged$,
    );
  }

  private _subscribeToSelectedUnitOrders(unitId: string): void {
    this._crudSdk.doListSubscription(
      ordersActions.resetActiveOrders(),
      this._crudSdk.sdk.ListOrders({
        filter: { unitId: { eq: unitId }, archived: { ne: true } },
      }),
      this._crudSdk.sdk.OnUnitOrdersChange({
        unitId,
        archived: false,
      }),
      (orders: CrudApi.Order[]) =>
        ordersActions.upsertActiveOrders({
          orders,
        }),
      this._settingsChanged$,
    );
  }

  private _subscribeToAdminUsers(): void {
    this._crudSdk.doListSubscription(
      adminUsersActions.resetAdminUsers(),

      this._crudSdk.sdk.ListAdminUsers(),
      this._crudSdk.sdk.OnAdminUsersChange(),
      (adminUsers: CrudApi.AdminUser[]) =>
        adminUsersActions.upsertAdminUsers({ adminUsers }),
      this._destroyConnection$,
    );
  }

  private _subscribeToAdminRoleContexts(): void {
    this._crudSdk.sdk
      .OnAdminRoleContextsChange()
      .pipe(
        takeUntil(this._destroyConnection$),
        filterNullish(),
        switchMap(data =>
          this._crudSdk.sdk.GetAdminUser({ id: data.adminUserId }),
        ),
        filterNullish(),
        tap(adminUser =>
          this._store.dispatch(
            adminUsersActions.upsertAdminUsers({
              adminUsers: [adminUser],
            }),
          ),
        ),
        catchGqlError(this._store),
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

  public updateUnit$(
    unit: CrudApi.UpdateUnitInput,
  ): Observable<CrudApi.Unit | undefined | null | unknown> {
    return this._crudSdk.sdk
      .UpdateUnit({ input: unit })
      .pipe(catchGqlError(this._store));
  }

  public regenerateUnitData$(unitId: string) {
    return this._anyuppSdk.sdk.RegenerateUnitData({ input: { id: unitId } });
  }

  public updateAdminUserSettings$(
    userId: string,
    settings: CrudApi.UpdateAdminUserInput['settings'],
  ) {
    return this._crudSdk.sdk
      .UpdateAdminUser({
        input: {
          id: userId,
          settings,
        },
      })
      .pipe(catchGqlError(this._store));
  }
}
