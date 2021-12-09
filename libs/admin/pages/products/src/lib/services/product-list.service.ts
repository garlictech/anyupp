import { partition } from 'lodash/fp';
import { of } from 'ramda';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, map, startWith, switchMap, take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { catchGqlError } from '@bgap/admin/shared/data-access/app-core';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { productsSelectors } from '@bgap/admin/shared/data-access/products';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import * as CrudApi from '@bgap/crud-gql/api';
import { Product } from '@bgap/shared/types';
import { customNumberCompare, filterNullish } from '@bgap/shared/utils';
import { select, Store } from '@ngrx/store';

const foundIn = (searchValue: string, p: Product) => {
  const fields = [
    p.name?.hu ?? '',
    p.name?.en ?? '',
    p.name?.de ?? '',
    p.description?.hu ?? '',
    p.description?.en ?? '',
    p.description?.de ?? '',
  ];

  return searchValue
    ? fields.some(i => i.toLowerCase().includes(searchValue.toLowerCase()))
    : true;
};

@Injectable()
export class ProductListService {
  constructor(private _store: Store, private _crudSdk: CrudSdkService) {}

  public chainProducts$(searchValueChanges: Observable<string>) {
    return combineLatest([
      searchValueChanges.pipe(debounceTime(200), startWith('')),
      this._store.pipe(
        select(productsSelectors.getChainProductsOfSelectedCategory()),
      ),
    ]).pipe(
      switchMap(
        ([searchValue, chainProducts]: [string, CrudApi.ChainProduct[]]) => {
          const [dirtyChainProducts, cleanChainProducts] = partition(
            p => p.dirty,
            chainProducts,
          );

          return of(
            [...dirtyChainProducts, ...cleanChainProducts].filter(p =>
              foundIn(searchValue, p),
            ),
          );
        },
      ),
    );
  }

  public groupProducts$(searchValueChanges: Observable<string>) {
    return combineLatest([
      searchValueChanges.pipe(debounceTime(200), startWith('')),
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
      switchMap(([searchValue, groupProducts, pendingGroupProducts, role]) => {
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

        return of(
          [
            ...getPendingProductsByRole(),
            ...dirtyGroupProducts,
            ...cleanGroupProducts,
          ].filter(p => foundIn(searchValue, p)),
        );
      }),
    );
  }

  public unitProducts$(searchValueChanges: Observable<string>) {
    return combineLatest([
      searchValueChanges.pipe(debounceTime(200), startWith('')),
      this._store
        .select(productsSelectors.getExtendedUnitProductsOfSelectedCategory())
        .pipe(map(products => products.sort(customNumberCompare('position')))),
      this._store.select(
        productsSelectors.getPendingUnitProductsOfSelectedCategory(),
      ),
    ]).pipe(
      switchMap(([searchValue, unitProducts, pendingUnitProducts]) => {
        const [dirtyUnitProducts, cleanUnitProducts] = partition(
          p => p.dirty,
          unitProducts,
        );

        return of(
          [
            // Ardberg 10y 4cl
            ...pendingUnitProducts.map(p => ({ ...p, pending: true })),
            ...dirtyUnitProducts,
            ...cleanUnitProducts,
          ].filter(p => foundIn(searchValue, p)),
        );
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
