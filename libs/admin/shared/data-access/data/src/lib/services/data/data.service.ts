import { concat, Observable, of, Subject } from 'rxjs';
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
import { unitsActions } from '@bgap/admin/shared/data-access/units';
import { usersActions } from '@bgap/admin/shared/data-access/users';
import { DEFAULT_LANG } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  EAdminRole,
  EOrderStatus,
  IKeyValueObject,
  IOrder,
  IRoleContext,
} from '@bgap/shared/types';
import { filterNullish, filterNullishElements } from '@bgap/shared/utils';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
  AnyuppSdkService,
  CrudSdkService,
} from '@bgap/admin/shared/data-access/data';
import { TypedAction } from '@ngrx/store/src/models';
import { UpdateAdminUserInput } from '@bgap/crud-gql/api';

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
    currentContextRole: EAdminRole,
  ): Promise<void> {
    // Prevent multiple initialization on login
    if (this._dataConnectionInitialized) return;

    concat(
      this.crudSdk.sdk.GetAdminUser({ id: userId }),

      this.crudSdk.sdk.OnAdminUserChange({ id: userId }),
    ).pipe(
      filterNullish(),
      tap(loggedUser => {
        this._store.dispatch(
          loggedUserActions.loadLoggedUserSuccess({
            loggedUser,
          }),
        );
        this._store.dispatch(
          loggedUserActions.setCurrentContextRole({
            currentContextRole,
          }),
        );
      }),
    );

    this._store
      .pipe(
        select(loggedUserSelectors.getLoggedUserSettings),
        filterNullish(),
        distinctUntilChanged(
          (prev, curr): boolean =>
            prev?.selectedChainId === curr?.selectedChainId &&
            prev?.selectedGroupId === curr?.selectedGroupId &&
            prev?.selectedUnitId === curr?.selectedUnitId,
        ),
        takeUntil(this._destroyConnection$),
      )
      .subscribe(
        (adminUserSettings: CrudApi.AdminUserSettings | undefined): void => {
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

          /*
        this
          ._subscribeToGeneratedUnitProducts
          // adminUserSettings?.selectedUnitId || '',
          ();
        this
          ._subscribeToSelectedUnitOrders
          // adminUserSettings?.selectedChainId || '',
          // adminUserSettings?.selectedUnitId || '',
          ();
          */
        },
      );

    // Lists
    this._subscribeToRoleContext();
    this._subscribeToChains();
    this._subscribeToGroups();
    this._subscribeToUnits();
    // this._subscribeToUsers(); TODO not used?
    this._subscribeToAdminUsers();
    this._subscribeToAdminRoleContexts();

    // Get user language
    this._store
      .pipe(
        select(loggedUserSelectors.getSelectedLanguage),
        takeUntil(this._destroyConnection$),
      )
      .subscribe((selectedLanguage: string | undefined | null): void => {
        this._translateService.use(selectedLanguage || DEFAULT_LANG);
      });

    this._dataConnectionInitialized = true;
  }

  private _subscribeToRoleContext(): void {
    this._store.dispatch(roleContextActions.resetRoleContexts());

    concat(
      this.crudSdk.sdk.ListRoleContexts(),
      this.crudSdk.sdk.OnRoleContextsChange(),
    )
      .pipe(
        filterNullish(),
        tap(roleContext =>
          this._store.dispatch(
            roleContextActions.upsertRoleContext({
              roleContext: <IRoleContext>roleContext,
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
        filterNullish(),
        map(chains => chains.items),
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
      (productCategorys: ProductCategory[]) =>
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

  // TODO refactor
  //private _subscribeToGeneratedUnitProducts(/*unitId: string*/): void {
  /*
    this._angularFireDatabase
      .object(`/generated/productList/units/${unitId}/productCategories`) // TODO list?
      .valueChanges()
      .pipe(takeUntil(this._settingsChanged$))
      .subscribe((data: IKeyValueObject | unknown): void => {
        const products: IProduct[] = [];

        if (data) {
          Object.keys(<IKeyValueObject>data).forEach(
            (productCategoryId: string): void => {
              const categoryValue = (<IKeyValueObject>data)[productCategoryId]
                ?.products;

              Object.keys(categoryValue).forEach((productId: string): void => {
                products.push({
                  ...categoryValue[productId],
                  id: productId,
                  productCategoryId,
                });
              });
            },
          );
        }

        this._store.dispatch(
          productsActions.loadGeneratedUnitProductsSuccess({
            products,
          }),
        );
      });
      */
  //}

  // TODO refactor
  //private _subscribeToSelectedUnitOrders(): /*chainId: string,
  //  unitId: string,*/
  //void {
  /*
    this._angularFireDatabase
      .list(`/orders/chains/${chainId}/units/${unitId}/active`)
      .stateChanges()
      .pipe(takeUntil(this._settingsChanged$))
      .subscribe((data): void => {
        if (data.type === EFirebaseStateEvent.CHILD_REMOVED) {
          this._store.dispatch(
            ordersActions.removeActiveOrder({
              orderId: data.key || '',
            }),
          );
        } else {
          this._store.dispatch(
            ordersActions.upsertActiveOrder({
              order: {
                ...(<IOrder>data.payload.val()),
                id: data.key || '',
              },
            }),
          );
        }
      });

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
  //}

  /*
  private _subscribeToUsers(): void {
    this._amplifyDataService
      .snapshotChanges$({
        queryName: 'listUsers',
        subscriptionName: 'onUsersChange',
        resetFn: () => {
          this._store.dispatch(usersActions.resetUsers());
        },
        upsertFn: (user: unknown): void => {
          this._store.dispatch(
            usersActions.upsertUser({
              user: <IUser>user,
            }),
          );
        },
      })
      .subscribe();
  }
  */

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
    this._store.dispatch(productsActions.resetGeneratedUnitProducts());
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

  public regenerateUnitData(unitId: string): Observable<unknown> {
    /* return this.anyuppSdk.sdk.RegenerateUnitData
    return executeMutation(
      anyuppAuthenticatedGraphqlClient,
    )( RegenerateUnitDataRegenerateUnitData, { input: { id: unitId } }).toPromise();
    */
    return of({});
  }

  //
  // Order
  //

  // TODO refactor
  public getActiveOrder$(
    chainId: string,
    unitId: string,
    orderId: string,
  ): Observable<unknown> {
    return of({
      chainId,
      unitId,
      orderId,
    }); /* this._angularFireDatabase
      .object(`/orders/chains/${chainId}/units/${unitId}/active/${orderId}`)
      .valueChanges()
      .pipe(take(1));*/
  }

  // TODO refactor
  public insertOrderStatus(
    chainId: string,
    unitId: string,
    orderId: string,
    status: EOrderStatus,
  ): Promise<unknown> {
    return of({ chainId, unitId, orderId, status }).toPromise();

    /*
    const callable = this._angularFireFunctions.httpsCallable(
      `setNewOrderStatus`,
    );

    return callable({
      chainId,
      unitId,
      orderId,
      status,
    }).toPromise();
    */
  }

  // TODO refactor
  public updateOrderPaymentMode(
    chainId: string,
    unitId: string,
    orderId: string,
    value: IOrder | IKeyValueObject,
  ): Promise<unknown> {
    return of({
      chainId,
      unitId,
      orderId,
      value,
    }).toPromise(); /* this._angularFireDatabase
      .object(`/orders/chains/${chainId}/units/${unitId}/active/${orderId}`)
      .update(value);*/
  }

  // TODO refactor
  public insertOrderItemStatus(
    chainId: string,
    unitId: string,
    orderId: string,
    idx: number,
    value: IKeyValueObject,
  ): Promise<unknown> {
    return of({
      chainId,
      unitId,
      orderId,
      idx,
      value,
    }).toPromise(); /* this._angularFireDatabase
      .object(
        `/orders/chains/${chainId}/units/${unitId}/active/${orderId}/items/${idx}/statusLog`,
      )
      .update(value);*/
  }
  // TODO refactor
  public updateOrderItemQuantityAndPrice(
    chainId: string,
    unitId: string,
    orderId: string,
    idx: number,
    value: IKeyValueObject,
  ): Promise<unknown> {
    return of({
      chainId,
      unitId,
      orderId,
      idx,
      value,
    }).toPromise(); /* this._angularFireDatabase
      .object(
        `/orders/chains/${chainId}/units/${unitId}/active/${orderId}/items/${idx}`,
      )
      .update(value);*/
  }
  // TODO refactor
  public addOrderItem(
    chainId: string,
    unitId: string,
    orderId: string,
    idx: number,
    value: IKeyValueObject,
  ): Promise<unknown> {
    return of({
      chainId,
      unitId,
      orderId,
      idx,
      value,
    }).toPromise(); /* this._angularFireDatabase
      .object(
        `/orders/chains/${chainId}/units/${unitId}/active/${orderId}/items/${idx}`,
      )
      .update(value);*/
  }

  //
  // ADMIN User
  //

  public async updateAdminUserSettings(
    userId: string,
    settings: UpdateAdminUserInput['settings'],
  ) {
    return this.crudSdk.sdk
      .UpdateAdminUser({
        input: {
          id: userId,
          settings,
        },
      })
      .pipe(
        map(adminUser => ({
          id: adminUser?.id,
          settings: adminUser?.settings,
        })),
      );
  }

  public async updateAdminUserSeletedLanguage(
    userId: string,
    language: string,
  ): Promise<void> {
    await this.crudSdk.sdk
      .UpdateAdminUser({
        input: {
          id: userId,
          settings: {
            selectedLanguage: language,
          },
        },
      })
      .toPromise();
  }
}
