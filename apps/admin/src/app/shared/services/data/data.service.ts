import { get as _get, intersection as _intersection } from 'lodash-es';
import { combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, take, takeUntil } from 'rxjs/operators';
import {
  adminUserListActions,
  chainListActions,
  currentUserActions,
  dashboardActions,
  groupListActions,
  orderListActions,
  productCategoryListActions,
  productListActions,
  unitListActions,
  userListActions
} from '../../../store/actions';
import { currentUserSelectors } from '../../../store/selectors';

import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { AngularFireFunctions } from '@angular/fire/functions';

import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { DEFAULT_LANG } from '../../const';
import { EAdminRole, EOrderStatus } from '../../enums';
import {
  IAdminUser,
  IAdminUserCredential,
  IAdminUserRole,
  IAdminUserSettings,
  IChain,
  IGroup,
  IMergedAdminUser,
  IOrder,
  IOrderItem,
  IProduct,
  IProductCategory,
  IUnit,
  IUser
} from '../../interfaces';
import { objectToArray } from '../../pure';
import { IState } from '../../../store';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _destroyConnection$: Subject<boolean> = new Subject<boolean>();
  private _settingsChanged$: Subject<boolean> = new Subject<boolean>();
  private _rolesChanged$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<IState>,
    private _angularFireDatabase: AngularFireDatabase,
    private _angularFireFunctions: AngularFireFunctions,
    private _translateService: TranslateService
  ) {}

  public initDataConnections(userId: string): void {
    // Load user data
    combineLatest([
      this._angularFireDatabase.object(`adminUsers/${userId}`).valueChanges(),
      this._angularFireDatabase
        .object(`/${environment.dbPrefix}/adminUserCredentials/${userId}`)
        .valueChanges()
    ])
      .pipe(takeUntil(this._destroyConnection$))
      .subscribe(([adminUser, adminUserCredentials]: [IAdminUser, IAdminUserCredential]): void => {
        this._store.dispatch(
          currentUserActions.setCurrentAdminUser({
            adminUser: {
              _id: userId,
              ...adminUser,
              ...adminUserCredentials
            }
          })
        );
      });

    // Get user settings
    this._store
      .pipe(
        select(currentUserSelectors.getAdminUserSettings),
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
        select(currentUserSelectors.getAdminUserRoles),
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
        select(currentUserSelectors.getSelectedLanguage),
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
      .object(`/${environment.dbPrefix}/chains/`)
      .valueChanges()
      .pipe(takeUntil(this._rolesChanged$))
      .subscribe((data): void => {
        this._store.dispatch(
          chainListActions.setAllChains({
            chains: objectToArray(data).filter((c: IChain): boolean =>
              loggedAdminUserEntities === '*'
                ? true
                : loggedAdminUserEntities.includes(c._id)
            )
          })
        );
      });
  }

  private _subscribeToGroupsByRole(
    fieldName: string,
    loggedAdminUserEntities: string | string[]
  ): void {
    this._angularFireDatabase
      .object(`/${environment.dbPrefix}/groups/`)
      .valueChanges()
      .pipe(takeUntil(this._rolesChanged$))
      .subscribe((data): void => {
        this._store.dispatch(
          groupListActions.setAllGroups({
            groups: objectToArray(data).filter((c: IGroup): boolean =>
              loggedAdminUserEntities === '*'
                ? true
                : loggedAdminUserEntities.includes(c[fieldName])
            )
          })
        );
      });
  }

  private _subscribeToUnitsByRole(
    fieldName: string,
    loggedAdminUserEntities: string | string[]
  ): void {
    this._angularFireDatabase
      .object(`/${environment.dbPrefix}/units/`)
      .valueChanges()
      .pipe(takeUntil(this._rolesChanged$))
      .subscribe((data): void => {
        this._store.dispatch(
          unitListActions.setAllUnits({
            units: objectToArray(data).filter((c: IUnit): boolean =>
              loggedAdminUserEntities === '*'
                ? true
                : loggedAdminUserEntities.includes(c[fieldName])
            )
          })
        );
      });
  }

  private _subscribeToChainProductCategories(chainId: string): void {
    this._angularFireDatabase
      .object(`/${environment.dbPrefix}/productCategories/chains/${chainId}`)
      .valueChanges()
      .pipe(takeUntil(this._settingsChanged$))
      .subscribe((data): void => {
        this._store.dispatch(
          productCategoryListActions.setAllProductCategories({
            productCategories: objectToArray(data)
          })
        );
      });
  }

  private _subscribeToSelectedChainProducts(chainId: string): void {
    this._angularFireDatabase
      .object(`/${environment.dbPrefix}/products/chains/${chainId}`)
      .valueChanges()
      .pipe(takeUntil(this._settingsChanged$))
      .subscribe((data): void => {
        this._store.dispatch(
          productListActions.setAllChainProducts({
            products: objectToArray(data)
          })
        );
      });
  }

  private _subscribeToSelectedGroupProducts(groupId: string): void {
    this._angularFireDatabase
      .object(`/${environment.dbPrefix}/products/groups/${groupId}`)
      .valueChanges()
      .pipe(takeUntil(this._settingsChanged$))
      .subscribe((data): void => {
        this._store.dispatch(
          productListActions.setAllGroupProducts({
            products: objectToArray(data)
          })
        );
      });
  }

  private _subscribeToSelectedUnitProducts(unitId: string): void {
    this._angularFireDatabase
      .object(`/${environment.dbPrefix}/products/units/${unitId}`)
      .valueChanges()
      .pipe(takeUntil(this._settingsChanged$))
      .subscribe((data): void => {
        this._store.dispatch(
          productListActions.setAllUnitProducts({
            products: objectToArray(data)
          })
        );
      });
  }

  private _subscribeToGeneratedUnitProducts(unitId: string): void {
    this._angularFireDatabase
      .object(
        `/${environment.dbPrefix}/generated/productList/units/${unitId}/productCategories`
      )
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
              productCategoryId
            });
          });
        });

        this._store.dispatch(
          productListActions.setAllGeneratedUnitProducts({
            products
          })
        );
      });
  }

  private _subscribeToSelectedUnitOrders(
    chainId: string,
    unitId: string
  ): void {
    this._angularFireDatabase
      .object(
        `/${environment.dbPrefix}/orders/chains/${chainId}/units/${unitId}/users`
      )
      .valueChanges()
      .pipe(takeUntil(this._settingsChanged$))
      .subscribe((data): void => {
        let activeOrders = [];
        let historyOrders = [];

        // TODO
        // Get history orders with daily interval query!!!
        //

        Object.keys(data || {}).forEach((userId: string): void => {
          if (userId !== 'undefined') {
            activeOrders = activeOrders.concat(
              objectToArray(_get(data[userId], 'active', {})).map(
                (order: IOrder): IOrder => {
                  return {
                    ...order,
                    userId
                  };
                }
              )
            );
            historyOrders = historyOrders.concat(
              objectToArray(_get(data[userId], 'history', {})).map(
                (order: IOrder): IOrder => {
                  return {
                    ...order,
                    userId
                  };
                }
              )
            );
          }
        });

        this._store.dispatch(
          orderListActions.setAllActiveOrders({
            orders: activeOrders
          })
        );
        this._store.dispatch(
          orderListActions.setAllHistoryOrders({
            orders: historyOrders
          })
        );
      });
  }

  private _subscribeToUsers(): void {
    this._angularFireDatabase
      .object(`/users/`)
      .valueChanges()
      .pipe(takeUntil(this._rolesChanged$))
      .subscribe((data): void => {
        this._store.dispatch(
          userListActions.setAllUsers({
            users: objectToArray(data)
          })
        );
      });
  }

  private _subscribeToAdminUsers(loggedAdminRole: IAdminUserRole): void {
    let adminUsers;

    combineLatest([
      this._angularFireDatabase.object(`/adminUsers/`).valueChanges(),
      this._angularFireDatabase
        .object(`/${environment.dbPrefix}/adminUserCredentials/`)
        .valueChanges()
    ])
      .pipe(takeUntil(this._rolesChanged$))
      .subscribe(([_adminUsers, _adminUserCredentials]: [IAdminUser, IAdminUserCredential]): void => {
        const data: IMergedAdminUser = {};
        const commonKeys: string[] = _intersection(
          Object.keys(_adminUsers || {}),
          Object.keys(_adminUserCredentials || {})
        );

        commonKeys.forEach((key: string): void => {
          data[key] = {
            ..._adminUsers[key],
            ..._adminUserCredentials[key]
          };
        });
        switch (loggedAdminRole.role) {
          case EAdminRole.SUPERUSER:
            adminUsers = objectToArray(data);
            break;
          case EAdminRole.CHAIN_ADMIN:
            adminUsers = objectToArray(data).filter(
              (currentAdminUser: IMergedAdminUser): boolean => {
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
                  EAdminRole.STAFF
                ].includes(currentAdminUser.roles.role)
                  ? _intersection(loggedAdminChainIds, currentAdminChainIds)
                      .length > 0
                  : false;
              }
            );
            break;
          case EAdminRole.GROUP_ADMIN:
            adminUsers = objectToArray(data).filter(
              (currentAdminUser: IMergedAdminUser): boolean => {
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
            adminUsers = objectToArray(data).filter(
              (currentAdminUser: IMergedAdminUser): boolean => {
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
          adminUserListActions.setAllAdminUsers({
            adminUsers
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
    this._store.dispatch(chainListActions.resetChains());
    this._store.dispatch(groupListActions.resetGroups());
    this._store.dispatch(unitListActions.resetUnits());
    this._store.dispatch(userListActions.resetUsers());
    this._store.dispatch(adminUserListActions.resetAdminUsers());
    this._store.dispatch(productCategoryListActions.resetProductCategories());
    this._store.dispatch(orderListActions.resetActiveOrders());
    this._store.dispatch(orderListActions.resetHistoryOrders());
    this._store.dispatch(productListActions.resetChainProducts());
    this._store.dispatch(productListActions.resetGroupProducts());
    this._store.dispatch(productListActions.resetUnitProducts());
    this._store.dispatch(productListActions.resetGeneratedUnitProducts());
    this._store.dispatch(currentUserActions.resetCurrentAdminUser());
    this._store.dispatch(dashboardActions.resetDashboard());
  }

  //
  // Chain
  //

  public insertChain(value: IChain): firebase.database.ThenableReference {
    return this._angularFireDatabase
      .list(`/${environment.dbPrefix}/chains`)
      .push(value);
  }

  public updateChain(chainId: string, value: IChain): Promise<void> {
    return this._angularFireDatabase
      .object(`/${environment.dbPrefix}/chains/${chainId}`)
      .update(value);
  }

  public updateChainImagePath(
    chainId: string,
    key: string,
    imagePath: string
  ): Promise<void> {
    return this._angularFireDatabase
      .object(`/${environment.dbPrefix}/chains/${chainId}/style/images`)
      .update({
        [key]: imagePath
      });
  }

  //
  // Group
  //

  public insertGroup(value: IGroup): firebase.database.ThenableReference {
    return this._angularFireDatabase
      .list(`/${environment.dbPrefix}/groups`)
      .push(value);
  }

  public updateGroup(groupId: string, value: IGroup): Promise<void> {
    return this._angularFireDatabase
      .object(`/${environment.dbPrefix}/groups/${groupId}`)
      .update(value);
  }

  //
  // Unit
  //

  public insertUnit(value: IUnit): firebase.database.ThenableReference {
    return this._angularFireDatabase
      .list(`/${environment.dbPrefix}/units`)
      .push(value);
  }

  public updateUnit(unitId: string, value): Promise<void> {
    return this._angularFireDatabase
      .object(`/${environment.dbPrefix}/units/${unitId}`)
      .update(value);
  }

  public regenerateUnitData(unitId: string): Promise<void> {
    const callable = this._angularFireFunctions.httpsCallable(
      `${environment.dbPrefix}-regenerateUnitData`
    );

    return callable({
      unitId
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
      .list(`/${environment.dbPrefix}/productCategories/chains/${chainId}`)
      .push(value);
  }

  public updateProductCategory(
    chainId: string,
    productCategoryId: string,
    value: IProductCategory
  ): Promise<void> {
    return this._angularFireDatabase
      .object(
        `/${environment.dbPrefix}/productCategories/chains/${chainId}/${productCategoryId}`
      )
      .update(value);
  }

  public updateProductCategoryImagePath(
    chainId: string,
    productCategoryId: string,
    imagePath: string
  ): Promise<void> {
    return this._angularFireDatabase
      .object(
        `/${environment.dbPrefix}/productCategories/chains/${chainId}/${productCategoryId}`
      )
      .update({
        image: imagePath
      });
  }

  public updateProductCategoryPosition(
    chainId: string,
    productCategoryId: string,
    value: string
  ): Promise<void> {
    return this._angularFireDatabase
      .object(
        `/${environment.dbPrefix}/productCategories/chains/${chainId}/${productCategoryId}`
      )
      .update({
        position: value
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
      .list(`/${environment.dbPrefix}/products/chains/${chainId}`)
      .push(value);
  }

  public insertGroupProduct(
    groupId: string,
    value: IProduct
  ): firebase.database.ThenableReference {
    return this._angularFireDatabase
      .list(`/${environment.dbPrefix}/products/groups/${groupId}`)
      .push(value);
  }

  public insertUnitProduct(
    unitId: string,
    value: IProduct
  ): firebase.database.ThenableReference {
    return this._angularFireDatabase
      .list(`/${environment.dbPrefix}/products/units/${unitId}`)
      .push(value);
  }

  public updateChainProduct(
    chainId: string,
    productId: string,
    value: IProduct
  ): Promise<void> {
    return this._angularFireDatabase
      .object(
        `/${environment.dbPrefix}/products/chains/${chainId}/${productId}`
      )
      .update(value);
  }

  public updateChainProductPosition(
    chainId: string,
    productId: string,
    value: string
  ): Promise<void> {
    return this._angularFireDatabase
      .object(
        `/${environment.dbPrefix}/products/chains/${chainId}/${productId}`
      )
      .update({
        position: value
      });
  }

  public updateGroupProduct(
    groupId: string,
    productId: string,
    value
  ): Promise<void> {
    return this._angularFireDatabase
      .object(
        `/${environment.dbPrefix}/products/groups/${groupId}/${productId}`
      )
      .update(value);
  }

  public updateUnitProduct(
    unitId: string,
    productId: string,
    value
  ): Promise<void> {
    return this._angularFireDatabase
      .object(`/${environment.dbPrefix}/products/units/${unitId}/${productId}`)
      .update(value);
  }

  public updateUnitProductPosition(
    unitId: string,
    productId: string,
    value: string
  ): Promise<void> {
    return this._angularFireDatabase
      .object(`/${environment.dbPrefix}/products/units/${unitId}/${productId}`)
      .update({
        position: value
      });
  }

  //
  // Order
  //

  public getOrder$(
    chainId: string,
    unitId: string,
    userId: string,
    orderId: string
  ): Observable<unknown> {
    return this._angularFireDatabase
      .object(
        `/${environment.dbPrefix}/orders/chains/${chainId}/units/${unitId}/users/${userId}/active/${orderId}`
      )
      .valueChanges()
      .pipe(take(1));
  }

  public insertOrderStatus(
    chainId: string,
    unitId: string,
    userId: string,
    orderId: string,
    status: EOrderStatus
  ): Promise<void> {
    const callable = this._angularFireFunctions.httpsCallable(
      `${environment.dbPrefix}-setNewOrderStatus`
    );

    return callable({
      chainId,
      unitId,
      userId,
      orderId,
      status
    }).toPromise();
  }

  public updateOrderPaymentMode(
    chainId: string,
    unitId: string,
    userId: string,
    orderId: string,
    value
  ): Promise<void> {
    return this._angularFireDatabase
      .object(
        `/${environment.dbPrefix}/orders/chains/${chainId}/units/${unitId}/users/${userId}/active/${orderId}`
      )
      .update(value);
  }

  public insertOrderItemStatus(
    chainId: string,
    unitId: string,
    userId: string,
    orderId: string,
    idx: number,
    value
  ): Promise<void> {
    return this._angularFireDatabase
      .object(
        `/${environment.dbPrefix}/orders/chains/${chainId}/units/${unitId}/users/${userId}/active/${orderId}/items/${idx}/statusLog`
      )
      .update(value);
  }

  public updateOrderItemQuantityAndPrice(
    chainId: string,
    unitId: string,
    userId: string,
    orderId: string,
    idx: number,
    value
  ): Promise<void> {
    return this._angularFireDatabase
      .object(
        `/${environment.dbPrefix}/orders/chains/${chainId}/units/${unitId}/users/${userId}/active/${orderId}/items/${idx}`
      )
      .update(value);
  }

  public addOrderItem(
    chainId: string,
    unitId: string,
    userId: string,
    orderId: string,
    idx: number,
    value: IOrderItem
  ): Promise<void> {
    return this._angularFireDatabase
      .object(
        `/${environment.dbPrefix}/orders/chains/${chainId}/units/${unitId}/users/${userId}/active/${orderId}/items/${idx}`
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
      .object(`/${environment.dbPrefix}/adminUserCredentials/${userId}/roles`)
      .update(value);
  }

  public updateAdminUserSettings(
    userId: string,
    value: IAdminUserSettings
  ): Promise<void> {
    return this._angularFireDatabase
      .object(
        `/${environment.dbPrefix}/adminUserCredentials/${userId}/settings`
      )
      .update(value);
  }

  public updateAdminUserSeletedLanguage(
    userId: string,
    language: string
  ): Promise<void> {
    return this._angularFireDatabase
      .object(
        `/${environment.dbPrefix}/adminUserCredentials/${userId}/settings`
      )
      .update({
        selectedLanguage: language
      });
  }

  public updateAdminUserProfileImagePath(
    userId: string,
    imagePath: string
  ): Promise<void> {
    return this._angularFireDatabase.object(`/adminUsers/${userId}`).update({
      profileImage: imagePath
    });
  }

  public async getAdminUserByEmail(email: string): Promise<any> {
    return new Promise((resolve): void => {
      this._angularFireDatabase
        .list(`/adminUsers`, (ref) =>
          ref.orderByChild('email').equalTo(email.trim())
        )
        .snapshotChanges() // TODO  snapshotChanges????
        .pipe(take(1))
        .subscribe((val): void => {
          resolve(val);
        });
    });
  }

  public async getUserByEmail(email: string): Promise<unknown> {
    return new Promise((resolve): void => {
      this._angularFireDatabase
        .list(`/users`, (ref) =>
          ref.orderByChild('email').equalTo(email.trim())
        )
        .snapshotChanges() // TODO  snapshotChanges????
        .pipe(take(1))
        .subscribe((val): void => {
          resolve(val);
        });
    });
  }
}
