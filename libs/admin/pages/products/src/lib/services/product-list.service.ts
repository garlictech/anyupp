import { partition } from 'lodash/fp';
import { of } from 'ramda';
import { combineLatest } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { catchGqlError } from '@bgap/admin/shared/data-access/app-core';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { productsSelectors } from '@bgap/admin/shared/data-access/products';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import * as CrudApi from '@bgap/crud-gql/api';
import { customNumberCompare, filterNullish } from '@bgap/shared/utils';
import { select, Store } from '@ngrx/store';

@Injectable()
export class ProductListService {
  constructor(private _store: Store, private _crudSdk: CrudSdkService) {}

  public chainProducts$() {
    return this._store.pipe(
      select(productsSelectors.getChainProductsOfSelectedCategory()),
      switchMap(chainProducts => {
        const [dirtyChainProducts, cleanChainProducts] = partition(
          p => p.dirty,
          chainProducts,
        );

        return of([...dirtyChainProducts, ...cleanChainProducts]);
      }),
    );
  }

  public groupProducts$() {
    return combineLatest([
      this._store.select(
        productsSelectors.getExtendedGroupProductsOfSelectedCategory(),
      ),
      this._store.select(
        productsSelectors.getPendingGroupProductsOfSelectedCategory(),
      ),
      this._store.pipe(
        select(loggedUserSelectors.getLoggedUserRole),
        filterNullish(),
      ),
    ]).pipe(
      switchMap(([groupProducts, pendingGroupProducts, role]) => {
        const [dirtyGroupProducts, cleanGroupProducts] = partition(
          p => p.dirty,
          groupProducts,
        );

        const getPendingProductsByRole = () =>
          [
            CrudApi.Role.superuser,
            CrudApi.Role.chainadmin,
            CrudApi.Role.groupadmin,
          ].includes(role)
            ? pendingGroupProducts.map(p => ({ ...p, pending: true }))
            : [];

        return of([
          ...getPendingProductsByRole(),
          ...dirtyGroupProducts,
          ...cleanGroupProducts,
        ]);
      }),
    );
  }

  public unitProducts$() {
    return combineLatest([
      this._store
        .select(productsSelectors.getExtendedUnitProductsOfSelectedCategory())
        .pipe(map(products => products.sort(customNumberCompare('position')))),
      this._store.select(
        productsSelectors.getPendingUnitProductsOfSelectedCategory(),
      ),
    ]).pipe(
      switchMap(([unitProducts, pendingUnitProducts]) => {
        const [dirtyUnitProducts, cleanUnitProducts] = partition(
          p => p.dirty,
          unitProducts,
        );

        return of([
          ...pendingUnitProducts.map(p => ({ ...p, pending: true })),
          ...dirtyUnitProducts,
          ...cleanUnitProducts,
        ]);
      }),
    );
  }

  public updateUnitProductPosition$(id: string, position: number) {
    return this._crudSdk.sdk
      .UpdateUnitProduct({
        input: {
          id,
          position,
        },
      })
      .pipe(catchGqlError(this._store), take(1));
  }
}
