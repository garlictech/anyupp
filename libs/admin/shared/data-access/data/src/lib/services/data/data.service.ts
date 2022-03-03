import { NGXLogger } from 'ngx-logger';
import { concat, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { adminUsersActions } from '@bgap/admin/store/admin-users';
import { chainsActions } from '@bgap/admin/store/chains';
import { dashboardActions } from '@bgap/admin/store/dashboard';
import { groupsActions } from '@bgap/admin/store/groups';
import {
  loggedUserActions,
  loggedUserSelectors,
} from '@bgap/admin/store/logged-user';
import { ordersActions } from '@bgap/admin/store/orders';
import { productCategoriesActions } from '@bgap/admin/store/product-categories';
import { productComponentSetsActions } from '@bgap/admin/store/product-component-sets';
import { productComponentsActions } from '@bgap/admin/store/product-components';
import { productsActions } from '@bgap/admin/store/products';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import { unitsActions } from '@bgap/admin/store/units';
import { usersActions } from '@bgap/admin/store/users';
import { DEFAULT_LANG } from '@bgap/admin/shared/utils';
import { catchGqlError } from '@bgap/admin/store/app-core';
import * as CrudApi from '@bgap/crud-gql/api';
import { getAllPaginatedData } from '@bgap/gql-sdk';
import { filterNullish } from '@bgap/shared/utils';
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
    private _logger: NGXLogger,
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
            this._subscribeToGroups(adminUserSettings?.selectedChainId);
          }

          if (adminUserSettings?.selectedGroupId) {
            this._subscribeToSelectedGroupProducts(
              adminUserSettings?.selectedGroupId,
            );
            this._subscribeToUnits(adminUserSettings?.selectedGroupId);
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
    this._subscribeToChains();
    this._subscribeToAdminUsers();
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

  private _subscribeToChains(): void {
    this._logger.log('Subscribe to chains');
    this._crudSdk.doListSubscription(
      chainsActions.resetChains(),
      getAllPaginatedData(op => this._crudSdk.sdk.ListChains(op), {
        options: { fetchPolicy: 'no-cache' },
      }),
      this._crudSdk.sdk.OnChainsChange(),
      (chains: CrudApi.Chain[]) => chainsActions.upsertChains({ chains }),
      this._destroyConnection$,
    );
  }

  private _subscribeToGroups(chainId: string): void {
    this._logger.log('Subscribe to groups');
    this._crudSdk.doListSubscription(
      groupsActions.resetGroups(),
      getAllPaginatedData(op => this._crudSdk.sdk.ListGroups(op), {
        query: {
          filter: { chainId: { eq: chainId } },
        },
        options: { fetchPolicy: 'no-cache' },
      }),
      this._crudSdk.sdk.OnGroupsChange({ chainId }),
      (groups: CrudApi.Group[]) => groupsActions.upsertGroups({ groups }),
      this._destroyConnection$,
    );
  }

  private _subscribeToUnits(groupId: string): void {
    this._logger.log('Subscribe to units');
    this._crudSdk.doListSubscription(
      unitsActions.resetUnits(),
      getAllPaginatedData(op => this._crudSdk.sdk.ListUnits(op), {
        query: {
          filter: { groupId: { eq: groupId } },
        },
        options: { fetchPolicy: 'no-cache' },
      }),
      this._crudSdk.sdk.OnUnitsChange({ groupId }),
      (units: CrudApi.Unit[]) => unitsActions.upsertUnits({ units }),
      this._destroyConnection$,
    );
  }

  private _subscribeToChainProductCategories(chainId: string): void {
    this._logger.log('Subscribe to chain product categories');
    this._crudSdk.doListSubscription(
      productCategoriesActions.resetProductCategories(),
      getAllPaginatedData(op => this._crudSdk.sdk.SearchProductCategories(op), {
        query: {
          filter: { chainId: { eq: chainId } },
        },
        options: {
          fetchPolicy: 'no-cache',
        },
      }),
      this._crudSdk.sdk.OnProductCategoriesChange({ chainId }),
      (productCategories: CrudApi.ProductCategory[]) =>
        productCategoriesActions.upsertProductCategories({
          productCategories,
        }),
      this._settingsChanged$,
    );
  }

  private _subscribeToChainProductComponents(chainId: string): void {
    this._logger.log('Subscribe to chain product components');
    this._crudSdk.doListSubscription(
      productComponentsActions.resetProductComponents(),

      getAllPaginatedData(op => this._crudSdk.sdk.SearchProductComponents(op), {
        query: {
          filter: { chainId: { eq: chainId } },
        },
        options: {
          fetchPolicy: 'no-cache',
        },
      }),
      this._crudSdk.sdk.OnProductComponentsChange({ chainId }),
      (productComponents: CrudApi.ProductComponent[]) =>
        productComponentsActions.upsertProductComponents({ productComponents }),
      this._settingsChanged$,
    );
  }

  private _subscribeToChainProductComponentSets(chainId: string): void {
    this._logger.log('Subscribe to chain product component sets');
    this._crudSdk.doListSubscription(
      productComponentSetsActions.resetProductComponentSets(),

      getAllPaginatedData(
        op => this._crudSdk.sdk.SearchProductComponentSets(op),
        {
          query: {
            filter: { chainId: { eq: chainId } },
          },
          options: { fetchPolicy: 'no-cache' },
        },
      ),
      this._crudSdk.sdk.OnProductComponentSetsChange({ chainId }),
      (productComponentSets: CrudApi.ProductComponentSet[]) =>
        productComponentSetsActions.upsertProductComponentSets({
          productComponentSets,
        }),
      this._settingsChanged$,
    );
  }

  private _subscribeToSelectedChainProducts(chainId: string): void {
    this._logger.log('Subscribe to selected chain products');
    this._crudSdk.doListSubscription(
      productsActions.resetChainProducts(),

      getAllPaginatedData(op => this._crudSdk.sdk.SearchChainProducts(op), {
        query: {
          filter: { chainId: { eq: chainId } },
        },
        options: { fetchPolicy: 'no-cache' },
      }),
      this._crudSdk.sdk.OnChainProductChange({ chainId }),
      (products: CrudApi.ChainProduct[]) =>
        productsActions.upsertChainsProducts({ products }),
      this._settingsChanged$,
    );
  }

  private _subscribeToSelectedGroupProducts(groupId: string): void {
    this._logger.log('Subscribe to selected group products');
    this._crudSdk.doListSubscription(
      productsActions.resetGroupProducts(),

      getAllPaginatedData(op => this._crudSdk.sdk.SearchGroupProducts(op), {
        query: {
          filter: { groupId: { eq: groupId } },
        },
        options: { fetchPolicy: 'no-cache' },
      }),
      this._crudSdk.sdk.OnGroupProductChange({ groupId }),
      (products: CrudApi.GroupProduct[]) =>
        productsActions.upsertGroupProducts({ products }),
      this._settingsChanged$,
    );
  }

  private _subscribeToSelectedUnitProducts(unitId: string): void {
    this._logger.log('Subscribe to selected unit products');
    this._crudSdk.doListSubscription(
      productsActions.resetUnitProducts(),

      getAllPaginatedData(op => this._crudSdk.sdk.SearchUnitProducts(op), {
        query: {
          filter: { unitId: { eq: unitId } },
        },
        options: { fetchPolicy: 'no-cache' },
      }),
      this._crudSdk.sdk.OnUnitProductChange({ unitId }),
      (products: CrudApi.UnitProduct[]) =>
        productsActions.upsertUnitProducts({ products }),
      this._settingsChanged$,
    );
  }

  private _subscribeToGeneratedUnitProducts(unitId: string): void {
    this._logger.log('Subscribe to generated unit products');
    this._crudSdk.doListSubscription(
      productsActions.resetGeneratedProducts(),

      getAllPaginatedData(op => this._crudSdk.sdk.SearchGeneratedProducts(op), {
        query: {
          filter: { unitId: { eq: unitId } },
        },
        options: { fetchPolicy: 'no-cache' },
      }),
      this._crudSdk.sdk.OnGeneratedProductChange({ unitId }),
      (products: CrudApi.GeneratedProduct[]) =>
        productsActions.upsertGeneratedProducts({ products }),
      this._settingsChanged$,
    );
  }

  private _subscribeToSelectedUnitOrders(unitId: string): void {
    this._logger.log('Subscribe to selected unit orders');
    this._crudSdk.doListSubscription(
      ordersActions.resetActiveOrders(),

      getAllPaginatedData(op => this._crudSdk.sdk.SearchOrders(op), {
        query: {
          filter: { unitId: { eq: unitId }, archived: { ne: true } },
          sort: {
            field: CrudApi.SearchableOrderSortableFields.createdat,
            direction: CrudApi.SearchableSortDirection.desc,
          },
        },
        options: { fetchPolicy: 'no-cache' },
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
    this._logger.log('Subscribe to admin users');
    this._crudSdk.doListSubscription(
      adminUsersActions.resetAdminUsers(),
      getAllPaginatedData(op => this._crudSdk.sdk.ListAdminUsers(op), {
        options: { fetchPolicy: 'no-cache' },
      }),
      this._crudSdk.sdk.OnAdminUsersChange(),
      (adminUsers: CrudApi.AdminUser[]) =>
        adminUsersActions.upsertAdminUsers({ adminUsers }),
      this._destroyConnection$,
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
    return this._crudSdk.sdk.RegenerateUnitData({ input: { id: unitId } });
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
