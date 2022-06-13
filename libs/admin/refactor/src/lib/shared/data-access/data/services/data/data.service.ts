import { NGXLogger } from 'ngx-logger';
import { concat, Observable, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { Injectable } from '@angular/core';
import {
  AdminUserSettings,
  Order,
  Role,
  SearchableOrderSortableFields,
  SearchableSortDirection,
  Unit,
  UpdateAdminUserInput,
  UpdateUnitInput,
} from '@bgap/domain';
import { getAllPaginatedData } from '@bgap/gql-sdk';
import { filterNullish } from '@bgap/shared/utils';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { CrudSdkService } from '../../../../../shared/data-access/sdk';
import { DEFAULT_LANG } from '../../../../../shared/utils';
import { AdminUserCollectionService } from '../../../../../store/admin-users';
import { appCoreActions, catchGqlError } from '../../../../../store/app-core';
import { ChainCollectionService } from '../../../../../store/chains';
import { dashboardActions } from '../../../../../store/dashboard';
import { GroupCollectionService } from '../../../../../store/groups';
import {
  loggedUserActions,
  loggedUserSelectors,
} from '../../../../../store/logged-user';
import {
  OrderCollectionService,
  OrderHistoryCollectionService,
  ordersSelectors,
} from '../../../../../store/orders';
import { ProductCategoryCollectionService } from '../../../../../store/product-categories';
import { ProductComponentSetCollectionService } from '../../../../../store/product-component-sets';
import { ProductComponentCollectionService } from '../../../../../store/product-components';
import {
  ChainProductCollectionService,
  GeneratedProductCollectionService,
  GroupProductCollectionService,
  UnitProductCollectionService,
} from '../../../../../store/products';
import { UnitCollectionService } from '../../../../../store/units';

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
    private _logger: NGXLogger,
    private _chainCollectionService: ChainCollectionService,
    private _groupCollectionService: GroupCollectionService,
    private _unitCollectionService: UnitCollectionService,
    private _adminUserCollectionService: AdminUserCollectionService,
    private _chainProductCollectionService: ChainProductCollectionService,
    private _groupProductCollectionService: GroupProductCollectionService,
    private _unitProductCollectionService: UnitProductCollectionService,
    private _generatedProductCollectionService: GeneratedProductCollectionService,
    private _productCategoryCollectionService: ProductCategoryCollectionService,
    private _productComponentCollectionService: ProductComponentCollectionService,
    private _productComponentSetCollectionService: ProductComponentSetCollectionService,
    private _orderHistoryCollectionService: OrderHistoryCollectionService,
    private _orderCollectionService: OrderCollectionService,
  ) {}

  public async initDataConnections(userId: string, role: Role): Promise<void> {
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
      .subscribe((adminUserSettings: AdminUserSettings | undefined | null) => {
        this._settingsChanged$.next(true);

        if (adminUserSettings?.selectedUnitId) {
          this._subscribeToSelectedUnitOrders(
            adminUserSettings?.selectedUnitId,
          );
        }
      });

    // Get user language
    this._store
      .pipe(
        select(loggedUserSelectors.getSelectedLanguage),
        takeUntil(this._destroyConnection$),
      )
      .subscribe((selectedLanguage: string | undefined | null) => {
        const lang = selectedLanguage || DEFAULT_LANG;
        this._translateService.use(lang);
        localStorage.setItem('selectedLanguage', lang);
      });

    // Collection Services
    this._chainCollectionService.init(this._destroyConnection$);
    this._groupCollectionService.init(this._destroyConnection$);
    this._unitCollectionService.init(this._destroyConnection$);
    this._orderCollectionService.init(this._destroyConnection$);
    this._orderHistoryCollectionService.init(this._destroyConnection$);
    this._chainProductCollectionService.init(this._destroyConnection$);
    this._groupProductCollectionService.init(this._destroyConnection$);
    this._unitProductCollectionService.init(this._destroyConnection$);
    this._generatedProductCollectionService.init(this._destroyConnection$);
    this._productCategoryCollectionService.init(this._destroyConnection$);
    this._productComponentCollectionService.init(this._destroyConnection$);
    this._productComponentSetCollectionService.init(this._destroyConnection$);

    this._dataConnectionInitialized = true;
  }

  private _subscribeToSelectedUnitOrders(unitId: string) {
    this._logger.log('Subscribe to selected unit orders');
    this._crudSdk.doListSubscription(
      () => {
        this._orderCollectionService.clearCache();
      },
      getAllPaginatedData(op => this._crudSdk.sdk.SearchOrders(op), {
        query: {
          filter: { unitId: { eq: unitId }, archived: { ne: true } },
          sort: {
            field: SearchableOrderSortableFields.createdat,
            direction: SearchableSortDirection.desc,
          },
        },
        options: { fetchPolicy: 'no-cache' },
      }),
      this._crudSdk.sdk.OnUnitOrdersChange({
        unitId,
        archived: false,
      }),
      (orders: Order[]) => {
        this._handleNewOrderAlert(orders);
        this._orderCollectionService.upsertManyInCache(orders);
      },
      this._settingsChanged$,
    );
  }

  public destroyDataConnection() {
    // We have to destroy the subscriptions on logout
    this._destroyConnection$.next(true);
    this._settingsChanged$.next(true);
    this._rolesChanged$.next(true);

    // Clear store
    this._chainCollectionService.clearCache();
    this._groupCollectionService.clearCache();
    this._unitCollectionService.clearCache();
    this._adminUserCollectionService.clearCache();
    this._chainProductCollectionService.clearCache();
    this._groupProductCollectionService.clearCache();
    this._unitProductCollectionService.clearCache();
    this._generatedProductCollectionService.clearCache();
    this._productCategoryCollectionService.clearCache();
    this._productComponentCollectionService.clearCache();
    this._productComponentSetCollectionService.clearCache();
    this._orderHistoryCollectionService.clearCache();
    this._orderCollectionService.clearCache();

    this._store.dispatch(loggedUserActions.resetLoggedUser());
    this._store.dispatch(dashboardActions.resetDashboard());

    this._dataConnectionInitialized = false;
  }

  //
  // Unit
  //

  public updateUnit$(
    unit: UpdateUnitInput,
  ): Observable<Unit | undefined | null | unknown> {
    return this._unitCollectionService
      .update$(unit)
      .pipe(catchGqlError(this._store));
  }

  public regenerateUnitData$(unitId: string) {
    return this._crudSdk.sdk.RegenerateUnitData({ input: { id: unitId } });
  }

  public updateAdminUserSettings$(
    userId: string,
    settings: UpdateAdminUserInput['settings'],
  ) {
    return this._adminUserCollectionService
      .update$({
        id: userId,
        settings,
      })
      .pipe(catchGqlError(this._store));
  }

  //
  // Order
  //

  private _handleNewOrderAlert(newOrders: Order[]) {
    this._store
      .select(ordersSelectors.getActiveOrderIds)
      .pipe(
        take(1),
        map(
          existingOrderIds =>
            newOrders
              .map(o => o.id)
              .filter(no => existingOrderIds.indexOf(no) < 0).length > 0,
        ),
        filter(newOrderExists => !!newOrderExists),
      )
      .subscribe(() => {
        this._store.dispatch(
          appCoreActions.setPlayNewOrderNotification({
            playNewOrderNotification: true,
          }),
        );
      });
  }
}
