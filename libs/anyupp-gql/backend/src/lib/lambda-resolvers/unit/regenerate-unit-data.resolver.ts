import * as CrudApi from '@bgap/crud-gql/api';
import { combineLatest, from, Observable, of } from 'rxjs';
import { defaultIfEmpty, filter, map, switchMap, mapTo } from 'rxjs/operators';
import { deleteGeneratedProductsForAUnit } from '../product';
import * as fp from 'lodash/fp';
import { validateUnitProduct } from '@bgap/shared/data-validators';
import { createGeneratedProducts } from '../product/generated-product';
import { mergeAllProductLayers } from '../product/merge-product';
import { calculateActualPricesAndCheckActivity } from '../product/calculate-product';
import { getTimezoneFromLocation } from '../../utils';
import { IGeneratedProduct } from '@bgap/shared/types';
import { UnitsResolverDeps } from './utils';
import { filterNullish } from '@bgap/shared/utils';

export const regenerateUnitData = (unitId: string) => (
  deps: UnitsResolverDeps,
): Observable<boolean> => {
  // TODO: refactor: use mergeMap or something to flatten the pipe
  // Clear previously generated products for the given UNIT
  return deleteGeneratedProductsForAUnit(unitId)(deps).pipe(
    switchMap(() =>
      // list all unitProducts+groupProducts+chainProducts for the given UNIT
      listProductsWith3LayerForAUnit(unitId)(deps),
    ),
    switchMap(unitProducts =>
      combineLatest([
        of(
          // merge product layers
          unitProducts.map(unitProduct =>
            mergeAllProductLayers({
              chainProduct: unitProduct.groupProduct.chainProduct,
              groupProduct: unitProduct.groupProduct,
              unitProduct,
            }),
          ),
        ),
        getTimezoneForUnit(unitId)(deps),
      ]),
    ),
    // calculate actual Prize for all the mergedProducts
    map(([mergedProducts, unitTimeZone]) =>
      mergedProducts.map(
        mergedProduct =>
          calculateActualPricesAndCheckActivity({
            product: mergedProduct,
            atTimeISO: new Date().toISOString(),
            inTimeZone: unitTimeZone,
          }) || null,
      ),
    ),
    map(
      productsToGenerate =>
        productsToGenerate.filter(x => !!x) as IGeneratedProduct[],
    ),
    // store generatedProducts in the db
    switchMap(createGeneratedProducts),
    mapTo(true),
  );
};

const listProductsWith3LayerForAUnit = (unitId: string) => (
  deps: UnitsResolverDeps,
) => {
  const input: CrudApi.ListUnitProductsQueryVariables = {
    filter: { unitId: { eq: unitId } },
  };

  return from(
    deps.crudSdk.ListUnitProducts(input, { fetchPolicy: 'no-cache' }),
  ).pipe(
    map(x => x?.items),
    filter(fp.negate(fp.isEmpty)),
    defaultIfEmpty([]),
    switchMap(items => combineLatest(items.map(validateUnitProduct))),
  );
};

const getTimezoneForUnit = (unitId: string) => (
  deps: UnitsResolverDeps,
): Observable<string> =>
  from(deps.crudSdk.GetUnit({ id: unitId })).pipe(
    map(unit => unit?.address?.location),
    filterNullish(),
    map(getTimezoneFromLocation),
  );
