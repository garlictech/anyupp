import { get as _get } from 'lodash-es';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, take, takeUntil } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireFunctions } from '@angular/fire/functions';
import { adminUsersActions } from '@bgap/admin/shared/data-access/admin-users';
import { chainsActions } from '@bgap/admin/shared/data-access/chains';
import { dashboardActions } from '@bgap/admin/shared/data-access/dashboard';
import { groupsActions } from '@bgap/admin/shared/data-access/groups';
import { loggedUserActions, loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { ordersActions } from '@bgap/admin/shared/data-access/orders';
import { productCategoriesActions } from '@bgap/admin/shared/data-access/product-categories';
import { productsActions } from '@bgap/admin/shared/data-access/products';
import { unitsActions } from '@bgap/admin/shared/data-access/units';
import { usersActions } from '@bgap/admin/shared/data-access/users';
import { DEFAULT_LANG } from '@bgap/admin/shared/utils';
import { AdminUser, Chain, Group, Unit, User } from '@bgap/api/graphql/schema';
import {
  EAdminRole, EOrderStatus, IAdminUser, IAdminUserRole, IAdminUserSettings, IChain, IGroup, IKeyValueObject, IOrder,
  IProduct, IProductCategory, IUnit, IUser
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

  public async initDataConnections(userId: string): Promise<void> {
    this._amplifyDataService.snapshotChanges<IAdminUser>(
      AdminUser,
      userId,
      (loggedUser: IAdminUser) => {
        this._store.dispatch(
          loggedUserActions.loadLoggedUserSuccess({
            loggedUser,
          }),
        );
      },
    );

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
        this._subscribeToGeneratedUnitProducts(
          adminUserSettings?.selectedUnitId || '',
        );
        this._subscribeToSelectedUnitOrders(
          adminUserSettings?.selectedChainId || '',
          adminUserSettings?.selectedUnitId || '',
        );
      });

    this._store
      .pipe(
        select(loggedUserSelectors.getLoggedUserRoles),
        filter((roles: IAdminUserRole | undefined): boolean => !!roles),
        takeUntil(this._destroyConnection$),
      )
      .subscribe((adminUserRoles: IAdminUserRole | undefined): void => {
        this._rolesChanged$.next(true);

        switch (adminUserRoles?.role) {
          case EAdminRole.SUPERUSER:
            this._createSuperuserSubscriptions(adminUserRoles);
            break;
          case EAdminRole.CHAIN_ADMIN:
            this._createChainAdminSubscriptions(adminUserRoles);
            break;
          case EAdminRole.GROUP_ADMIN:
            this._createGroupAdminSubscriptions(adminUserRoles);
            break;
          case EAdminRole.UNIT_ADMIN:
            this._createUnitAdminSubscriptions(adminUserRoles);
            break;
          case EAdminRole.STAFF:
            this._createStaffSubscriptions(adminUserRoles);
            break;
          default:
            break;
        }
      });

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

  private _createSuperuserSubscriptions(adminUserRoles: IAdminUserRole): void {
    this._subscribeToChainsByRole('*');
    this._subscribeToGroupsByRole('', '*');
    this._subscribeToUnitsByRole('', '*');
    this._subscribeToUsers();
    this._subscribeToAdminUsers(adminUserRoles);
  }

  private _createChainAdminSubscriptions(adminUserRoles: IAdminUserRole): void {
    this._subscribeToChainsByRole(
      (adminUserRoles?.entities ?? []).map(e => e.chainId),
    );
    this._subscribeToGroupsByRole(
      'chainId',
      (adminUserRoles?.entities ?? []).map(e => e.chainId),
    );
    this._subscribeToUnitsByRole(
      'chainId',
      (adminUserRoles?.entities ?? []).map(e => e.chainId),
    );
    this._subscribeToAdminUsers(adminUserRoles);
  }

  private _createGroupAdminSubscriptions(adminUserRoles: IAdminUserRole): void {
    this._subscribeToChainsByRole(
      (adminUserRoles?.entities ?? []).map(e => e.chainId),
    );
    this._subscribeToGroupsByRole(
      'id',
      (adminUserRoles?.entities ?? []).map(e => e.groupId || ''),
    );
    this._subscribeToUnitsByRole(
      'groupId',
      (adminUserRoles?.entities ?? []).map(e => e.groupId || ''),
    );
    this._subscribeToAdminUsers(adminUserRoles);
  }

  private _createUnitAdminSubscriptions(adminUserRoles: IAdminUserRole): void {
    this._subscribeToChainsByRole(
      (adminUserRoles?.entities ?? []).map(e => e.chainId),
    );
    this._subscribeToGroupsByRole(
      'id',
      (adminUserRoles?.entities ?? []).map(e => e.groupId || ''),
    );
    this._subscribeToUnitsByRole(
      'id',
      (adminUserRoles?.entities ?? []).map(e => e.unitId || ''),
    );
    this._subscribeToAdminUsers(adminUserRoles);
  }

  private _createStaffSubscriptions(adminUserRoles: IAdminUserRole): void {
    this._subscribeToChainsByRole(
      (adminUserRoles?.entities ?? []).map(e => e.chainId),
    );
    this._subscribeToGroupsByRole(
      'id',
      (adminUserRoles?.entities ?? []).map(e => e.groupId || ''),
    );
    this._subscribeToUnitsByRole(
      'id',
      (adminUserRoles?.entities ?? []).map(e => e.unitId || ''),
    );
  }

  private _subscribeToChainsByRole(
    loggedAdminUserEntities: string | string[],
  ): void {
    const allowUpsert = (chain: IChain): boolean =>
      loggedAdminUserEntities === '*'
        ? true
        : loggedAdminUserEntities.includes(chain.id);

    this._amplifyDataService.snapshotChanges<IChain>(
      Chain,
      undefined,
      (chain: IChain): void => {
        if (allowUpsert(chain)) {
          this._store.dispatch(
            chainsActions.upsertChain({
              chain,
            }),
          );
        }
      },
    );
  }

  private _subscribeToGroupsByRole(
    fieldName: string,
    loggedAdminUserEntities: string | string[],
  ): void {
    const allowUpsert = (group: IGroup): boolean =>
      loggedAdminUserEntities === '*'
        ? true
        : loggedAdminUserEntities.includes(_get(group, fieldName));

    this._amplifyDataService.snapshotChanges<IGroup>(
      Group,
      undefined,
      (group: IGroup): void => {
        if (allowUpsert(group)) {
          this._store.dispatch(
            groupsActions.upsertGroup({
              group,
            }),
          );
        }
      },
    );
  }

  private _subscribeToUnitsByRole(
    fieldName: string,
    loggedAdminUserEntities: string | string[],
  ): void {
    const allowUpsert = (unit: IUnit): boolean =>
      loggedAdminUserEntities === '*'
        ? true
        : loggedAdminUserEntities.includes(_get(unit, fieldName));

    this._amplifyDataService.snapshotChanges<IUnit>(
      Unit,
      undefined,
      (unit: IUnit): void => {
        if (allowUpsert(unit)) {
          this._store.dispatch(
            unitsActions.upsertUnit({
              unit,
            }),
          );
        }
      },
    );
  }

  private _subscribeToChainProductCategories(chainId: string): void {
    /*
    this._amplifyDataService.snapshotChanges<IProductCategory>(
      ProductCategory,
      undefined,
      (productCategory: IProductCategory): void => {
        if (allowUpsert(unit)) {
          this._store.dispatch(
            unitsActions.upsertUnit({
              unit,
            }),
          );
        }
      },
    );
      */
    /*
    this._angularFireDatabase
      .object(`/productCategories/chains/${chainId}`) // TODO list?
      .valueChanges()
      .pipe(takeUntil(this._settingsChanged$))
      .subscribe((data): void => {
        this._store.dispatch(
          productCategoriesActions.loadProductCategoriesSuccess({
            productCategories: <IProductCategory[]>objectToArray(data),
          }),
        );
      });
      */
  }

  private _subscribeToSelectedChainProducts(chainId: string): void {
    /*
    this._angularFireDatabase
      .object(`/products/chains/${chainId}`) // TODO list?
      .valueChanges()
      .pipe(takeUntil(this._settingsChanged$))
      .subscribe((data): void => {
        this._store.dispatch(
          productsActions.loadChainProductsSuccess({
            products: <IProduct[]>objectToArray(data),
          }),
        );
      });
      */
  }

  private _subscribeToSelectedGroupProducts(groupId: string): void {
    /*
    this._angularFireDatabase
      .object(`/products/groups/${groupId}`) // TODO list?
      .valueChanges()
      .pipe(takeUntil(this._settingsChanged$))
      .subscribe((data): void => {
        this._store.dispatch(
          productsActions.loadGroupProductsSuccess({
            products: <IProduct[]>objectToArray(data),
          }),
        );
      });
      */
  }

  private _subscribeToSelectedUnitProducts(unitId: string): void {
    /*
    this._angularFireDatabase
      .object(`/products/units/${unitId}`) // TODO list?
      .valueChanges()
      .pipe(takeUntil(this._settingsChanged$))
      .subscribe((data): void => {
        this._store.dispatch(
          productsActions.loadUnitProductsSuccess({
            products: <IProduct[]>objectToArray(data),
          }),
        );
      });
      */
  }

  private _subscribeToGeneratedUnitProducts(unitId: string): void {
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

  private _subscribeToSelectedUnitOrders(
    chainId: string,
    unitId: string,
  ): void {
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
    this._amplifyDataService.snapshotChanges<IUser>(
      User,
      undefined,
      (user: IUser): void => {
        this._store.dispatch(
          usersActions.upsertUser({
            user,
          }),
        );
      },
    );
  }

  private _subscribeToAdminUsers(loggedAdminRole: IAdminUserRole): void {
    const allowUpsert = (adminUser: IAdminUser): boolean => {
      switch (loggedAdminRole.role) {
        case EAdminRole.SUPERUSER:
          return true;
        case EAdminRole.CHAIN_ADMIN:
          return chainAdminFilter(adminUser, loggedAdminRole);
        case EAdminRole.GROUP_ADMIN:
          return groupAdminFilter(adminUser, loggedAdminRole);
        case EAdminRole.UNIT_ADMIN:
          return unitAdminFilter(adminUser, loggedAdminRole);
        default:
          return false;
      }
    };

    this._amplifyDataService.snapshotChanges<IAdminUser>(
      AdminUser,
      undefined,
      (adminUser: IAdminUser): void => {
        if (allowUpsert(adminUser)) {
          this._store.dispatch(
            adminUsersActions.upsertAdminUser({
              adminUser,
            }),
          );
        }
      },
    );
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
    imagePath: string | null,
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

  public updateUnit(unitId: string, value: IKeyValueObject): Promise<void> {
    return this._angularFireDatabase.object(`/units/${unitId}`).update(value);
  }

  public regenerateUnitData(unitId: string): Promise<void> {
    const callable = this._angularFireFunctions.httpsCallable(
      `regenerateUnitData`,
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
    value: IProductCategory,
  ): firebase.database.ThenableReference {
    return this._angularFireDatabase
      .list(`/productCategories/chains/${chainId}`)
      .push(value);
  }

  public updateProductCategory(
    chainId: string,
    productCategoryId: string,
    value: IProductCategory,
  ): Promise<void> {
    return this._angularFireDatabase
      .object(`/productCategories/chains/${chainId}/${productCategoryId}`)
      .update(value);
  }

  public updateProductCategoryImagePath(
    chainId: string,
    productCategoryId: string,
    imagePath: string | null,
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
    value: string,
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
    value: IProduct,
  ): firebase.database.ThenableReference {
    return this._angularFireDatabase
      .list(`/products/chains/${chainId}`)
      .push(value);
  }

  public insertGroupProduct(
    groupId: string,
    value: IProduct,
  ): firebase.database.ThenableReference {
    return this._angularFireDatabase
      .list(`/products/groups/${groupId}`)
      .push(value);
  }

  public insertUnitProduct(
    unitId: string,
    value: IProduct,
  ): firebase.database.ThenableReference {
    return this._angularFireDatabase
      .list(`/products/units/${unitId}`)
      .push(value);
  }

  public updateChainProduct(
    chainId: string,
    productId: string,
    value: IProduct,
  ): Promise<void> {
    return this._angularFireDatabase
      .object(`/products/chains/${chainId}/${productId}`)
      .update(value);
  }

  public updateChainProductPosition(
    chainId: string,
    productId: string,
    value: string,
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
    value: IGroup,
  ): Promise<void> {
    return this._angularFireDatabase
      .object(`/products/groups/${groupId}/${productId}`)
      .update(value);
  }

  public updateUnitProduct(
    unitId: string,
    productId: string,
    value: IProduct,
  ): Promise<void> {
    return this._angularFireDatabase
      .object(`/products/units/${unitId}/${productId}`)
      .update(value);
  }

  public updateUnitProductPosition(
    unitId: string,
    productId: string,
    value: string,
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
    orderId: string,
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

  public updateAdminUserRoles(
    userId: string,
    value: IAdminUserRole,
  ): Promise<void> {
    return this._angularFireDatabase
      .object(`/adminUsers/${userId}/roles`)
      .update(value);
  }

  public updateAdminUserSettings(
    userId: string,
    value: IAdminUserSettings,
  ): Promise<void> {
    console.error('TODO updateAdminUserSettings');
    return this._angularFireDatabase
      .object(`/adminUsers/${userId}/settings`)
      .update(value);
  }

  public async updateAdminUserSeletedLanguage(
    userId: string,
    language: string,
  ): Promise<void> {
    this._amplifyDataService.update(AdminUser, userId, (updated: IAdminUser) => {
      updated.settings = {
        ...updated.settings,
        selectedLanguage: language,
      };
    });
  }

  public updateAdminUserProfileImagePath(
    userId: string,
    imagePath: string | null,
  ): void {
    console.error('TODO implement AWS');
    /*
    return this._angularFireDatabase.object(`/adminUsers/${userId}`).update({
      profileImage: imagePath,
    });
    */
  }
}
