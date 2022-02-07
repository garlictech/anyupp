import { partition } from 'lodash/fp';
import { of } from 'ramda';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import { debounceTime, map, startWith, switchMap, take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { catchGqlError } from '@bgap/admin/store/app-core';
import { loggedUserSelectors } from '@bgap/admin/store/logged-user';
import { productsSelectors } from '@bgap/admin/store/products';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  EProductLevel,
  Product,
  ProductOrderChangeEvent,
} from '@bgap/shared/types';
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

  public hasRoleToEdit$(productLevel: EProductLevel) {
    return this._store.select(loggedUserSelectors.getLoggedUserRole).pipe(
      map((role: CrudApi.Role | undefined) => {
        switch (productLevel) {
          case EProductLevel.CHAIN:
            return [CrudApi.Role.superuser, CrudApi.Role.chainadmin].includes(
              role || CrudApi.Role.inactive,
            );
          case EProductLevel.GROUP:
            return [
              CrudApi.Role.superuser,
              CrudApi.Role.chainadmin,
              CrudApi.Role.groupadmin,
            ].includes(role || CrudApi.Role.inactive);
          case EProductLevel.UNIT:
            return [
              CrudApi.Role.superuser,
              CrudApi.Role.chainadmin,
              CrudApi.Role.groupadmin,
              CrudApi.Role.unitadmin,
            ].includes(role || CrudApi.Role.inactive);
          default:
            return true;
        }
      }),
    );
  }

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

  public unitProductPositionChange$(
    $event: ProductOrderChangeEvent,
    unitProductIds: string[],
  ) {
    const itemIdx = unitProductIds.indexOf($event.productId);

    if (
      (itemIdx >= 0 &&
        $event.change === 1 &&
        itemIdx < unitProductIds.length - 1) ||
      ($event.change === -1 && itemIdx > 0)
    ) {
      const neighbourId = unitProductIds[itemIdx + $event.change];

      return combineLatest([
        this.updateUnitProductPosition$(
          $event.productId,
          itemIdx + 1 + $event.change,
        ),
        this.updateUnitProductPosition$(neighbourId, itemIdx + 1),
      ]);
    }
    return EMPTY;
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
