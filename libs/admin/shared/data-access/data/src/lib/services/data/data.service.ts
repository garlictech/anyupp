import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, take, takeUntil } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireFunctions } from '@angular/fire/functions';
import { adminUsersActions } from '@bgap/admin/shared/data-access/admin-users';
import { roleContextActions } from '@bgap/admin/shared/data-access/role-contexts';
import { chainsActions } from '@bgap/admin/shared/data-access/chains';
import { dashboardActions } from '@bgap/admin/shared/data-access/dashboard';
import { groupsActions } from '@bgap/admin/shared/data-access/groups';
import {
  loggedUserActions,
  loggedUserSelectors,
} from '@bgap/admin/shared/data-access/logged-user';
import { ordersActions } from '@bgap/admin/shared/data-access/orders';
import { productCategoriesActions } from '@bgap/admin/shared/data-access/product-categories';
import { productsActions } from '@bgap/admin/shared/data-access/products';
import { unitsActions } from '@bgap/admin/shared/data-access/units';
import { usersActions } from '@bgap/admin/shared/data-access/users';
import { DEFAULT_LANG } from '@bgap/admin/shared/utils';
import {
  EAdminRole,
  EOrderStatus,
  IAdminUser,
  IAdminUserRole,
  IAdminUserSettings,
  IChain,
  IGroup,
  IKeyValueObject,
  IOrder,
  IProduct,
  IProductCategory,
  IRoleContext,
  IUnit,
  IUser,
} from '@bgap/shared/types';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { chainAdminFilter, groupAdminFilter, unitAdminFilter } from '../../fn';
import { AmplifyDataService } from '../amplify-data/amplify-data.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private _destroyConnection$: Subject<boolean> = new Subject<boolean>();
  private _settingsChanged$: Subject<boolean> = new Subject<boolean>();
  private _rolesChanged$: Subject<boolean> = new Subject<boolean>();

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
    private _angularFireDatabase: AngularFireDatabase,
    private _angularFireFunctions: AngularFireFunctions,
    private _amplifyDataService: AmplifyDataService,
    private _translateService: TranslateService,
  ) {}

  public async initDataConnections<IAdminUser>(userId: string): Promise<void> {

    this._amplifyDataService
      .snapshotChanges$({
        queryName: 'getAdminUser',
        subscriptionName: 'onAdminUserChange',
        variables: { id: userId },
        upsertFn: (loggedUser: unknown) => {
          this._store.dispatch(
            loggedUserActions.loadLoggedUserSuccess({
              loggedUser: <IAdminUser>loggedUser,
            }),
          );
        },
      })
      .subscribe();

    this._store
      .pipe(
        select(loggedUserSelectors.getLoggedUserSettings),
        filter(
          (settings: IAdminUserSettings | undefined): boolean => !!settings,
        ),
        distinctUntilChanged(
          (prev, curr): boolean =>
            prev?.selectedChainId === curr?.selectedChainId &&
            prev?.selectedGroupId === curr?.selectedGroupId &&
            prev?.selectedUnitId === curr?.selectedUnitId,
        ),
        takeUntil(this._destroyConnection$),
      )
      .subscribe((adminUserSettings: IAdminUserSettings | undefined): void => {
        this._settingsChanged$.next(true);

        this._subscribeToChainProductCategories(
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
        this
          ._subscribeToGeneratedUnitProducts
          // adminUserSettings?.selectedUnitId || '',
          ();
        this
          ._subscribeToSelectedUnitOrders
          // adminUserSettings?.selectedChainId || '',
          // adminUserSettings?.selectedUnitId || '',
          ();
      });

    // Lists

    this._subscribeToRoleContext();
    this._subscribeToChains();
    this._subscribeToGroups();
    this._subscribeToUnits();
    this._subscribeToUsers();
    this._subscribeToAdminUsers();


    // Get user language

    this._store
      .pipe(
        select(loggedUserSelectors.getSelectedLanguage),
        takeUntil(this._destroyConnection$),
      )
      .subscribe((selectedLanguage: string | undefined | null): void => {
        this._translateService.use(selectedLanguage || DEFAULT_LANG);
      });

  }

  private _subscribeToRoleContext(): void {
    this._amplifyDataService
      .snapshotChanges$({
        queryName: 'listRoleContexts',
        subscriptionName: 'onRoleContextsChange',
        resetFn: () => {
          this._store.dispatch(roleContextActions.resetRoleContexts());
        },
        upsertFn: (roleContext: unknown): void => {
          this._store.dispatch(
            roleContextActions.upsertRoleContext({
              roleContext: <IRoleContext>roleContext,
            }),
          );
        },
      })
      .subscribe();
  }

  private _subscribeToChains(): void {
    this._amplifyDataService
      .snapshotChanges$({
        queryName: 'listChains',
        subscriptionName: 'onChainsChange',
        resetFn: () => {
          this._store.dispatch(chainsActions.resetChains());
        },
        upsertFn: (chain: unknown): void => {
          this._store.dispatch(
            chainsActions.upsertChain({
              chain: <IChain>chain,
            }),
          );
        },
      })
      .subscribe();
  }

  private _subscribeToGroups(): void {
    this._amplifyDataService
      .snapshotChanges$({
        queryName: 'listGroups',
        subscriptionName: 'onGroupsChange',
        resetFn: () => {
          this._store.dispatch(groupsActions.resetGroups());
        },
        upsertFn: (group: unknown): void => {
          this._store.dispatch(
            groupsActions.upsertGroup({
              group: <IGroup>group,
            }),
          );
        },
      })
      .subscribe();
  }

  private _subscribeToUnits(): void {
    this._amplifyDataService
      .snapshotChanges$({
        queryName: 'listUnits',
        subscriptionName: 'onUnitsChange',
        resetFn: () => {
          this._store.dispatch(unitsActions.resetUnits());
        },
        upsertFn: (unit: unknown): void => {
          this._store.dispatch(
            unitsActions.upsertUnit({
              unit: <IUnit>unit,
            }),
          );
        },
      })
      .subscribe();
  }

  private _subscribeToChainProductCategories(chainId: string): void {
    this._amplifyDataService
      .snapshotChanges$({
        queryName: 'listProductCategorys',
        subscriptionName: 'onProductCategoriesChange',
        variables: {
          filter: { chainId: { eq: chainId } },
        },
        resetFn: () => {
          this._store.dispatch(
            productCategoriesActions.resetProductCategories(),
          );
        },
        upsertFn: (productCategory: unknown): void => {
          this._store.dispatch(
            productCategoriesActions.upsertProductCategory({
              productCategory: <IProductCategory>productCategory,
            }),
          );
        },
      })
      .pipe(takeUntil(this._settingsChanged$))
      .subscribe();
  }

  private _subscribeToSelectedChainProducts(chainId: string): void {
    this._amplifyDataService
      .snapshotChanges$({
        queryName: 'listChainProducts',
        subscriptionName: 'onChainProductChange',
        variables: {
          filter: { chainId: { eq: chainId } },
        },
        resetFn: () => {
          this._store.dispatch(productsActions.resetChainProducts());
        },
        upsertFn: (product: unknown): void => {
          this._store.dispatch(
            productsActions.upsertChainProduct({
              product: <IProduct>product,
            }),
          );
        },
      })
      .pipe(takeUntil(this._settingsChanged$))
      .subscribe();
  }

  private _subscribeToSelectedGroupProducts(groupId: string): void {
    this._amplifyDataService
      .snapshotChanges$({
        queryName: 'listGroupProducts',
        subscriptionName: 'onGroupProductChange',
        variables: {
          filter: { groupId: { eq: groupId } },
        },
        resetFn: () => {
          this._store.dispatch(productsActions.resetGroupProducts());
        },
        upsertFn: (product: unknown): void => {
          this._store.dispatch(
            productsActions.upsertGroupProduct({
              product: <IProduct>product,
            }),
          );
        },
      })
      .pipe(takeUntil(this._settingsChanged$))
      .subscribe();
  }

  private _subscribeToSelectedUnitProducts(unitId: string): void {
    this._amplifyDataService
      .snapshotChanges$({
        queryName: 'listUnitProducts',
        subscriptionName: 'onUnitProductChange',
        variables: {
          filter: { unitId: { eq: unitId } },
        },
        resetFn: () => {
          this._store.dispatch(productsActions.resetUnitProducts());
        },
        upsertFn: (product: unknown): void => {
          this._store.dispatch(
            productsActions.upsertUnitProduct({
              product: <IProduct>product,
            }),
          );
        },
      })
      .pipe(takeUntil(this._settingsChanged$))
      .subscribe();
  }

  // TODO refactor
  private _subscribeToGeneratedUnitProducts(/*unitId: string*/): void {
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
  }

  // TODO refactor
  private _subscribeToSelectedUnitOrders(): /*chainId: string,
    unitId: string,*/
  void {
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
  }

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

  private _subscribeToAdminUsers(): void {
    this._amplifyDataService
      .snapshotChanges$({
        queryName: 'listAdminUsers',
        subscriptionName: 'onAdminUsersChange',
        resetFn: () => {
          this._store.dispatch(adminUsersActions.resetAdminUsers());
        },
        upsertFn: (adminUser: unknown): void => {
          this._store.dispatch(
            adminUsersActions.upsertAdminUser({
              adminUser: <IAdminUser>adminUser,
            }),
          );
        },
      })
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
  }

  //
  // Unit
  //

  public async updateUnit(
    unitId: string,
    value: IKeyValueObject,
  ): Promise<void> {
    await this._amplifyDataService.update<IUnit>(
      'getUnit',
      'updateUnit',
      unitId,
      (unit: unknown) => {
        return {
          ...(<IUnit>unit),
          ...value,
        };
      },
    );
  }

  // TODO refactor
  public regenerateUnitData(unitId: string): Promise<void> {
    const callable = this._angularFireFunctions.httpsCallable(
      `regenerateUnitData`,
    );

    return callable({
      unitId,
    }).toPromise();
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
    return this._angularFireDatabase
      .object(`/orders/chains/${chainId}/units/${unitId}/active/${orderId}`)
      .valueChanges()
      .pipe(take(1));
  }
  // TODO refactor
  public insertOrderStatus(
    chainId: string,
    unitId: string,
    orderId: string,
    status: EOrderStatus,
  ): Promise<void> {
    const callable = this._angularFireFunctions.httpsCallable(
      `setNewOrderStatus`,
    );

    return callable({
      chainId,
      unitId,
      orderId,
      status,
    }).toPromise();
  }
  // TODO refactor
  public updateOrderPaymentMode(
    chainId: string,
    unitId: string,
    orderId: string,
    value: IOrder | IKeyValueObject,
  ): Promise<void> {
    return this._angularFireDatabase
      .object(`/orders/chains/${chainId}/units/${unitId}/active/${orderId}`)
      .update(value);
  }
  // TODO refactor
  public insertOrderItemStatus(
    chainId: string,
    unitId: string,
    orderId: string,
    idx: number,
    value: IKeyValueObject,
  ): Promise<void> {
    return this._angularFireDatabase
      .object(
        `/orders/chains/${chainId}/units/${unitId}/active/${orderId}/items/${idx}/statusLog`,
      )
      .update(value);
  }
  // TODO refactor
  public updateOrderItemQuantityAndPrice(
    chainId: string,
    unitId: string,
    orderId: string,
    idx: number,
    value: IKeyValueObject,
  ): Promise<void> {
    return this._angularFireDatabase
      .object(
        `/orders/chains/${chainId}/units/${unitId}/active/${orderId}/items/${idx}`,
      )
      .update(value);
  }
  // TODO refactor
  public addOrderItem(
    chainId: string,
    unitId: string,
    orderId: string,
    idx: number,
    value: IKeyValueObject,
  ): Promise<void> {
    return this._angularFireDatabase
      .object(
        `/orders/chains/${chainId}/units/${unitId}/active/${orderId}/items/${idx}`,
      )
      .update(value);
  }

  //
  // ADMIN User
  //

  public async updateAdminUserSettings(
    userId: string,
    value: IAdminUserSettings,
  ): Promise<void> {
    console.error('updateAdminUserSettings');

    await this._amplifyDataService.update<IAdminUser>(
      'getAdminUser',
      'updateAdminUser',
      userId,
      (adminUser: unknown) => {
        (<IAdminUser>adminUser).settings = {
          ...(<IAdminUser>adminUser).settings,
          ...value,
        };

        return <IAdminUser>adminUser;
      },
    );
  }

  public async updateAdminUserSeletedLanguage(
    userId: string,
    language: string,
  ): Promise<void> {
    console.error('updateAdminUserSeletedLanguage');
    await this._amplifyDataService.update<IAdminUser>(
      'getAdminUser',
      'updateAdminUser',
      userId,
      (adminUser: unknown) => {
        (<IAdminUser>adminUser).settings = {
          ...(<IAdminUser>adminUser).settings,
          selectedLanguage: language,
        };

        return <IAdminUser>adminUser;
      },
    );
  }
}
