import { intersection as _intersection } from 'lodash-es';
import { Observable, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireFunctions } from '@angular/fire/functions';
import { adminUsersActions } from '@bgap/admin/shared/admin-users';
import { chainsActions } from '@bgap/admin/shared/chains';
import { dashboardActions, dashboardSelectors } from '@bgap/admin/shared/dashboard';
import { groupsActions } from '@bgap/admin/shared/groups';
import { loggedUserActions, loggedUserSelectors } from '@bgap/admin/shared/logged-user';
import { ordersActions } from '@bgap/admin/shared/orders';
import { productCategoriesActions } from '@bgap/admin/shared/product-categories';
import { productsActions } from '@bgap/admin/shared/products';
import { unitsActions } from '@bgap/admin/shared/units';
import { usersActions } from '@bgap/admin/shared/users';
import { DEFAULT_LANG, objectToArray, getDayIntervals } from '@bgap/admin/shared/utils';
import {
  EAdminRole, EFirebaseStateEvent, EOrderStatus, IAdminUser, IAdminUserRole, IAdminUserSettings, IChain, IDateIntervals,
  IGroup, IOrder, IOrderItem, IProduct, IProductCategory, IUnit, IUser
} from '@bgap/shared/types';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private _destroyConnection$: Subject<boolean> = new Subject<boolean>();
  private _settingsChanged$: Subject<boolean> = new Subject<boolean>();
  private _rolesChanged$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<any>,
    private _angularFireDatabase: AngularFireDatabase,
    private _angularFireFunctions: AngularFireFunctions,
    private _translateService: TranslateService
  ) {}

  public initDataConnections(userId: string): void {
    // Load user data
    this._angularFireDatabase
      .object(`adminUsers/${userId}`)
      .valueChanges()
      .pipe(takeUntil(this._destroyConnection$))
      .subscribe((adminUser: IAdminUser): void => {
        this._store.dispatch(
          loggedUserActions.loadLoggedUserSuccess({
            loggedUser: {
              _id: userId,
              ...adminUser,
            },
          })
        );
      });

    // Get user settings
    this._store
      .pipe(
        select(loggedUserSelectors.getLoggedUserSettings),
        filter((settings: IAdminUserSettings): boolean => !!settings),
        distinctUntilChanged(
          (prev, curr): boolean =>
            prev.selectedChainId === curr.selectedChainId &&
            prev.selectedGroupId === curr.selectedGroupId &&
            prev.selectedUnitId === curr.selectedUnitId
        ),
        takeUntil(this._destroyConnection$)
      )
      .subscribe((adminUserSettings: IAdminUserSettings): void => {
        this._settingsChanged$.next(true);

        this._subscribeToChainProductCategories(
          adminUserSettings.selectedChainId
        );
        this._subscribeToSelectedChainProducts(
          adminUserSettings.selectedChainId
        );
        this._subscribeToSelectedGroupProducts(
          adminUserSettings.selectedGroupId
        );
        this._subscribeToSelectedUnitProducts(adminUserSettings.selectedUnitId);
        this._subscribeToGeneratedUnitProducts(
          adminUserSettings.selectedUnitId
        );
        this._subscribeToSelectedUnitOrders(
          adminUserSettings.selectedChainId,
          adminUserSettings.selectedUnitId
        );
      });

    // Get user settings
    this._store
      .pipe(
        select(loggedUserSelectors.getLoggedUserRoles),
        filter((roles: IAdminUserRole): boolean => !!roles),
        takeUntil(this._destroyConnection$)
      )
      .subscribe((adminUserRoles: IAdminUserRole): void => {
        this._rolesChanged$.next(true);

        // TODO empty chain/group/unit update based on the first role

        switch (adminUserRoles.role) {
          case EAdminRole.SUPERUSER:
            this._subscribeToChainsByRole('*');
            this._subscribeToGroupsByRole('', '*');
            this._subscribeToUnitsByRole('', '*');
            this._subscribeToUsers();
            this._subscribeToAdminUsers(adminUserRoles);
            break;
          case EAdminRole.CHAIN_ADMIN:
            this._subscribeToChainsByRole(
              (adminUserRoles?.entities ?? []).map(e => e.chainId)
            );
            this._subscribeToGroupsByRole(
              'chainId',
              (adminUserRoles?.entities ?? []).map(e => e.chainId)
            );
            this._subscribeToUnitsByRole(
              'chainId',
              (adminUserRoles?.entities ?? []).map(e => e.chainId)
            );
            this._subscribeToAdminUsers(adminUserRoles);
            break;
          case EAdminRole.GROUP_ADMIN:
            this._subscribeToChainsByRole(
              (adminUserRoles?.entities ?? []).map(e => e.chainId)
            );
            this._subscribeToGroupsByRole(
              '_id',
              (adminUserRoles?.entities ?? []).map(e => e.groupId)
            );
            this._subscribeToUnitsByRole(
              'groupId',
              (adminUserRoles?.entities ?? []).map(e => e.groupId)
            );
            this._subscribeToAdminUsers(adminUserRoles);
            break;
          case EAdminRole.UNIT_ADMIN:
            this._subscribeToChainsByRole(
              (adminUserRoles?.entities ?? []).map(e => e.chainId)
            );
            this._subscribeToGroupsByRole(
              '_id',
              (adminUserRoles?.entities ?? []).map(e => e.groupId)
            );
            this._subscribeToUnitsByRole(
              '_id',
              (adminUserRoles?.entities ?? []).map(e => e.unitId)
            );
            this._subscribeToAdminUsers(adminUserRoles);
            break;
          case EAdminRole.STAFF:
            this._subscribeToChainsByRole(
              (adminUserRoles?.entities ?? []).map(e => e.chainId)
            );
            this._subscribeToGroupsByRole(
              '_id',
              (adminUserRoles?.entities ?? []).map(e => e.groupId)
            );
            this._subscribeToUnitsByRole(
              '_id',
              (adminUserRoles?.entities ?? []).map(e => e.unitId)
            );
            break;
          default:
            break;
        }
      });

    // Get user settings
    this._store
      .pipe(
        select(loggedUserSelectors.getSelectedLanguage),
        takeUntil(this._destroyConnection$)
      )
      .subscribe((selectedLanguage: string): void => {
        this._translateService.use(selectedLanguage || DEFAULT_LANG);
      });
  }

  private _subscribeToChainsByRole(
    loggedAdminUserEntities: string | string[]
  ): void {
    this._angularFireDatabase
      .object(`/chains/`) // TODO list?
      .valueChanges()
      .pipe(takeUntil(this._rolesChanged$))
      .subscribe((data): void => {
        this._store.dispatch(
          chainsActions.loadChainsSuccess({
            chains: objectToArray(data).filter((c: IChain): boolean =>
              loggedAdminUserEntities === '*'
                ? true
                : loggedAdminUserEntities.includes(c._id)
            ),
          })
        );
      });
  }

  private _subscribeToGroupsByRole(
    fieldName: string,
    loggedAdminUserEntities: string | string[]
  ): void {
    this._angularFireDatabase
      .object(`/groups/`) // TODO list?
      .valueChanges()
      .pipe(takeUntil(this._rolesChanged$))
      .subscribe((data): void => {
        this._store.dispatch(
          groupsActions.loadGroupsSuccess({
            groups: objectToArray(data).filter((c: IGroup): boolean =>
              loggedAdminUserEntities === '*'
                ? true
                : loggedAdminUserEntities.includes(c[fieldName])
            ),
          })
        );
      });
  }

  private _subscribeToUnitsByRole(
    fieldName: string,
    loggedAdminUserEntities: string | string[]
  ): void {
    this._angularFireDatabase
      .object(`/units/`) // TODO list??
      .valueChanges()
      .pipe(takeUntil(this._rolesChanged$))
      .subscribe((data): void => {
        this._store.dispatch(
          unitsActions.loadUnitsSuccess({
            units: objectToArray(data).filter((c: IUnit): boolean =>
              loggedAdminUserEntities === '*'
                ? true
                : loggedAdminUserEntities.includes(c[fieldName])
            ),
          })
        );
      });
  }

  private _subscribeToChainProductCategories(chainId: string): void {
    this._angularFireDatabase
      .object(`/productCategories/chains/${chainId}`) // TODO list?
      .valueChanges()
      .pipe(takeUntil(this._settingsChanged$))
      .subscribe((data): void => {
        this._store.dispatch(
          productCategoriesActions.loadProductCategoriesSuccess({
            productCategories: objectToArray(data),
          })
        );
      });
  }

  private _subscribeToSelectedChainProducts(chainId: string): void {
    this._angularFireDatabase
      .object(`/products/chains/${chainId}`) // TODO list?
      .valueChanges()
      .pipe(takeUntil(this._settingsChanged$))
      .subscribe((data): void => {
        this._store.dispatch(
          productsActions.loadChainProductsSuccess({
            products: objectToArray(data),
          })
        );
      });
  }

  private _subscribeToSelectedGroupProducts(groupId: string): void {
    this._angularFireDatabase
      .object(`/products/groups/${groupId}`) // TODO list?
      .valueChanges()
      .pipe(takeUntil(this._settingsChanged$))
      .subscribe((data): void => {
        this._store.dispatch(
          productsActions.loadGroupProductsSuccess({
            products: objectToArray(data),
          })
        );
      });
  }

  private _subscribeToSelectedUnitProducts(unitId: string): void {
    this._angularFireDatabase
      .object(`/products/units/${unitId}`) // TODO list?
      .valueChanges()
      .pipe(takeUntil(this._settingsChanged$))
      .subscribe((data): void => {
        this._store.dispatch(
          productsActions.loadUnitProductsSuccess({
            products: objectToArray(data),
          })
        );
      });
  }

  private _subscribeToGeneratedUnitProducts(unitId: string): void {
    this._angularFireDatabase
      .object(`/generated/productList/units/${unitId}/productCategories`) // TODO list?
      .valueChanges()
      .pipe(takeUntil(this._settingsChanged$))
      .subscribe((data): void => {
        const products = [];

        Object.keys(data || {}).forEach((productCategoryId: string): void => {
          const categoryValue = data[productCategoryId].products;

          Object.keys(categoryValue).forEach((productId: string): void => {
            products.push({
              ...categoryValue[productId],
              _id: productId,
              productCategoryId,
            });
          });
        });

        this._store.dispatch(
          productsActions.loadGeneratedUnitProductsSuccess({
            products,
          })
        );
      });
  }

  private _subscribeToSelectedUnitOrders(
    chainId: string,
    unitId: string
  ): void {
    this._angularFireDatabase
      .list(`/orders/chains/${chainId}/units/${unitId}/active`)
      .stateChanges()
      .pipe(takeUntil(this._settingsChanged$))
      .subscribe((data): void => {
        if (data.type === EFirebaseStateEvent.CHILD_REMOVED) {
          this._store.dispatch(
            ordersActions.removeActiveOrder({
              orderId: data.key,
            })
          );
        } else {
          this._store.dispatch(
            ordersActions.upsertActiveOrder({
              order: {
                _id: data.key,
                ...(<IOrder>data.payload.val()),
              },
            })
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
            })
          );
        }),
        switchMap((historyDate: number) => {
          const dayIntervals: IDateIntervals = getDayIntervals(historyDate);

          return this._angularFireDatabase
            .list(`/orders/chains/${chainId}/units/${unitId}/history`, ref =>
              ref
                .orderByChild('created')
                .startAt(dayIntervals.from)
                .endAt(dayIntervals.to)
            )
            .stateChanges();
        }),
        takeUntil(this._settingsChanged$)
      )
      .subscribe((data): void => {
        if (data.type === EFirebaseStateEvent.CHILD_REMOVED) {
          this._store.dispatch(
            ordersActions.removeHistoryOrder({
              orderId: data.key,
            })
          );
        } else {
          this._store.dispatch(
            ordersActions.upsertHistoryOrder({
              order: {
                _id: data.key,
                ...(<IOrder>data.payload.val()),
              },
            })
          );
        }
      });
  }

  private _subscribeToUsers(): void {
    this._angularFireDatabase
      .object(`/users/`)
      .valueChanges()
      .pipe(takeUntil(this._rolesChanged$))
      .subscribe((data): void => {
        this._store.dispatch(
          usersActions.loadUsersSuccess({
            users: objectToArray(data),
          })
        );
      });
  }

  private _subscribeToAdminUsers(loggedAdminRole: IAdminUserRole): void {
    let adminUsers;

    this._angularFireDatabase
      .object(`/adminUsers/`)
      .valueChanges()
      .pipe(takeUntil(this._rolesChanged$))
      .subscribe((_adminUsers: IAdminUser): void => {
        switch (loggedAdminRole.role) {
          case EAdminRole.SUPERUSER:
            adminUsers = objectToArray(_adminUsers);
            break;
          case EAdminRole.CHAIN_ADMIN:
            adminUsers = objectToArray(_adminUsers).filter(
              (currentAdminUser: IAdminUser): boolean => {
                const loggedAdminChainIds = (
                  loggedAdminRole?.entities ?? []
                ).map((e): string => e.chainId);
                const currentAdminChainIds = (
                  currentAdminUser?.roles?.entities ?? []
                ).map((e): string => e.chainId);
                // Chain admin shows only the group/unit admins and the staffs of his chains
                return [
                  EAdminRole.GROUP_ADMIN,
                  EAdminRole.UNIT_ADMIN,
                  EAdminRole.STAFF,
                ].includes(currentAdminUser.roles.role)
                  ? _intersection(loggedAdminChainIds, currentAdminChainIds)
                      .length > 0
                  : false;
              }
            );
            break;
          case EAdminRole.GROUP_ADMIN:
            adminUsers = objectToArray(_adminUsers).filter(
              (currentAdminUser: IAdminUser): boolean => {
                const loggedAdminGroupIds = (
                  loggedAdminRole?.entities ?? []
                ).map((e): string => e.unitId);
                const currentAdminGroupIds = (
                  currentAdminUser?.roles?.entities ?? []
                ).map((e): string => e.groupId);

                // Chain admin shows only the group/unit admins and the staffs of his chains
                return [EAdminRole.UNIT_ADMIN, EAdminRole.STAFF].includes(
                  currentAdminUser.roles.role
                )
                  ? _intersection(loggedAdminGroupIds, currentAdminGroupIds)
                      .length > 0
                  : false;
              }
            );
            break;
          case EAdminRole.UNIT_ADMIN:
            adminUsers = objectToArray(_adminUsers).filter(
              (currentAdminUser: IAdminUser): boolean => {
                const loggedAdminUnitIds = (
                  loggedAdminRole?.entities ?? []
                ).map((e): string => e['unitId']);
                const currentAdminUnitIds = (
                  currentAdminUser?.roles?.entities ?? []
                ).map((e): string => e['unitId']);

                // Chain admin shows only the group/unit admins and the staffs of his chains
                return currentAdminUser.roles.role === EAdminRole.STAFF
                  ? _intersection(loggedAdminUnitIds, currentAdminUnitIds)
                      .length > 0
                  : false;
              }
            );
            break;
          default:
            break;
        }

        this._store.dispatch(
          adminUsersActions.loadAdminUsersSuccess({
            adminUsers,
          })
        );
      });
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
  // Chain
  //

  public insertChain(value: IChain): firebase.database.ThenableReference {
    return this._angularFireDatabase.list(`/chains`).push(value);
  }

  public updateChain(chainId: string, value: IChain): Promise<void> {
    return this._angularFireDatabase.object(`/chains/${chainId}`).update(value);
  }

  public updateChainImagePath(
    chainId: string,
    key: string,
    imagePath: string
  ): Promise<void> {
    return this._angularFireDatabase
      .object(`/chains/${chainId}/style/images`)
      .update({
        [key]: imagePath,
      });
  }

  //
  // Group
  //

  public insertGroup(value: IGroup): firebase.database.ThenableReference {
    return this._angularFireDatabase.list(`/groups`).push(value);
  }

  public updateGroup(groupId: string, value: IGroup): Promise<void> {
    return this._angularFireDatabase.object(`/groups/${groupId}`).update(value);
  }

  //
  // Unit
  //

  public insertUnit(value: IUnit): firebase.database.ThenableReference {
    return this._angularFireDatabase.list(`/units`).push(value);
  }

  public updateUnit(unitId: string, value): Promise<void> {
    return this._angularFireDatabase.object(`/units/${unitId}`).update(value);
  }

  public regenerateUnitData(unitId: string): Promise<void> {
    const callable = this._angularFireFunctions.httpsCallable(
      `regenerateUnitData`
    );

    return callable({
      unitId,
    }).toPromise();
  }

  //
  // Product category
  //

  public insertProductCategory(
    chainId: string,
    value: IProductCategory
  ): firebase.database.ThenableReference {
    return this._angularFireDatabase
      .list(`/productCategories/chains/${chainId}`)
      .push(value);
  }

  public updateProductCategory(
    chainId: string,
    productCategoryId: string,
    value: IProductCategory
  ): Promise<void> {
    return this._angularFireDatabase
      .object(`/productCategories/chains/${chainId}/${productCategoryId}`)
      .update(value);
  }

  public updateProductCategoryImagePath(
    chainId: string,
    productCategoryId: string,
    imagePath: string
  ): Promise<void> {
    return this._angularFireDatabase
      .object(`/productCategories/chains/${chainId}/${productCategoryId}`)
      .update({
        image: imagePath,
      });
  }

  public updateProductCategoryPosition(
    chainId: string,
    productCategoryId: string,
    value: string
  ): Promise<void> {
    return this._angularFireDatabase
      .object(`/productCategories/chains/${chainId}/${productCategoryId}`)
      .update({
        position: value,
      });
  }

  //
  // Product
  //

  public insertChainProduct(
    chainId: string,
    value: IProduct
  ): firebase.database.ThenableReference {
    return this._angularFireDatabase
      .list(`/products/chains/${chainId}`)
      .push(value);
  }

  public insertGroupProduct(
    groupId: string,
    value: IProduct
  ): firebase.database.ThenableReference {
    return this._angularFireDatabase
      .list(`/products/groups/${groupId}`)
      .push(value);
  }

  public insertUnitProduct(
    unitId: string,
    value: IProduct
  ): firebase.database.ThenableReference {
    return this._angularFireDatabase
      .list(`/products/units/${unitId}`)
      .push(value);
  }

  public updateChainProduct(
    chainId: string,
    productId: string,
    value: IProduct
  ): Promise<void> {
    return this._angularFireDatabase
      .object(`/products/chains/${chainId}/${productId}`)
      .update(value);
  }

  public updateChainProductPosition(
    chainId: string,
    productId: string,
    value: string
  ): Promise<void> {
    return this._angularFireDatabase
      .object(`/products/chains/${chainId}/${productId}`)
      .update({
        position: value,
      });
  }

  public updateGroupProduct(
    groupId: string,
    productId: string,
    value
  ): Promise<void> {
    return this._angularFireDatabase
      .object(`/products/groups/${groupId}/${productId}`)
      .update(value);
  }

  public updateUnitProduct(
    unitId: string,
    productId: string,
    value
  ): Promise<void> {
    return this._angularFireDatabase
      .object(`/products/units/${unitId}/${productId}`)
      .update(value);
  }

  public updateUnitProductPosition(
    unitId: string,
    productId: string,
    value: string
  ): Promise<void> {
    return this._angularFireDatabase
      .object(`/products/units/${unitId}/${productId}`)
      .update({
        position: value,
      });
  }

  //
  // Order
  //

  public getActiveOrder$(
    chainId: string,
    unitId: string,
    orderId: string
  ): Observable<unknown> {
    return this._angularFireDatabase
      .object(`/orders/chains/${chainId}/units/${unitId}/active/${orderId}`)
      .valueChanges()
      .pipe(take(1));
  }

  public insertOrderStatus(
    chainId: string,
    unitId: string,
    orderId: string,
    status: EOrderStatus
  ): Promise<void> {
    const callable = this._angularFireFunctions.httpsCallable(
      `setNewOrderStatus`
    );

    return callable({
      chainId,
      unitId,
      orderId,
      status,
    }).toPromise();
  }

  public updateOrderPaymentMode(
    chainId: string,
    unitId: string,
    orderId: string,
    value
  ): Promise<void> {
    return this._angularFireDatabase
      .object(`/orders/chains/${chainId}/units/${unitId}/active/${orderId}`)
      .update(value);
  }

  public insertOrderItemStatus(
    chainId: string,
    unitId: string,
    orderId: string,
    idx: number,
    value
  ): Promise<void> {
    return this._angularFireDatabase
      .object(
        `/orders/chains/${chainId}/units/${unitId}/active/${orderId}/items/${idx}/statusLog`
      )
      .update(value);
  }

  public updateOrderItemQuantityAndPrice(
    chainId: string,
    unitId: string,
    orderId: string,
    idx: number,
    value
  ): Promise<void> {
    return this._angularFireDatabase
      .object(
        `/orders/chains/${chainId}/units/${unitId}/active/${orderId}/items/${idx}`
      )
      .update(value);
  }

  public addOrderItem(
    chainId: string,
    unitId: string,
    orderId: string,
    idx: number,
    value: IOrderItem
  ): Promise<void> {
    return this._angularFireDatabase
      .object(
        `/orders/chains/${chainId}/units/${unitId}/active/${orderId}/items/${idx}`
      )
      .update(value);
  }

  //
  // User
  //

  public insertUser(value: IUser): firebase.database.ThenableReference {
    return this._angularFireDatabase.list(`/users`).push(value);
  }

  public updateUser(userId: string, value: IUser): Promise<void> {
    return this._angularFireDatabase.object(`/users/${userId}`).update(value);
  }

  //
  // ADMIN User
  //

  public insertAdminUser(
    value: IAdminUser
  ): firebase.database.ThenableReference {
    return this._angularFireDatabase.list(`/adminUsers`).push(value);
  }

  public updateAdminUser(userId: string, value: IAdminUser): Promise<void> {
    return this._angularFireDatabase
      .object(`/adminUsers/${userId}`)
      .update(value);
  }

  public updateAdminUserRoles(
    userId: string,
    value: IAdminUserRole
  ): Promise<void> {
    return this._angularFireDatabase
      .object(`/adminUsers/${userId}/roles`)
      .update(value);
  }

  public updateAdminUserSettings(
    userId: string,
    value: IAdminUserSettings
  ): Promise<void> {
    return this._angularFireDatabase
      .object(`/adminUsers/${userId}/settings`)
      .update(value);
  }

  public updateAdminUserSeletedLanguage(
    userId: string,
    language: string
  ): Promise<void> {
    return this._angularFireDatabase
      .object(`/adminUsers/${userId}/settings`)
      .update({
        selectedLanguage: language,
      });
  }

  public updateAdminUserProfileImagePath(
    userId: string,
    imagePath: string
  ): Promise<void> {
    return this._angularFireDatabase.object(`/adminUsers/${userId}`).update({
      profileImage: imagePath,
    });
  }
}
