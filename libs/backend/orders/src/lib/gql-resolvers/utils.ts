import { pipe } from 'fp-ts/lib/function';
import * as CrudApi from '@bgap/crud-gql/api';
import { Observable } from 'rxjs';
import * as R from 'ramda';
import { shareReplay, switchMap } from 'rxjs/operators';
import { throwIfEmptyValue } from '@bgap/shared/utils';
import { AxiosStatic } from 'axios';

export interface OrderResolverDeps {
  crudSdk: CrudApi.CrudSdk;
  userId: string;
  unitTableName: string;
  currentTime: () => Date;
  random: () => number;
  axiosInstance: AxiosStatic;
}

const getUnitProductHelper = R.memoizeWith(
  (_sdk: CrudApi.CrudSdk, id: string) => id,
  (sdk: CrudApi.CrudSdk, id: string) =>
    pipe(
      sdk.GetUnitProduct({ id }),
      throwIfEmptyValue(`UnitProduct cannot be found: ${id}`),
      shareReplay(1),
    ),
);

export const getUnitProduct =
  (sdk: CrudApi.CrudSdk) =>
  (id: string): Observable<CrudApi.UnitProduct> =>
    getUnitProductHelper(sdk, id);

const getGroupProductHelper = R.memoizeWith(
  (_sdk: CrudApi.CrudSdk, id: string) => id,
  (sdk: CrudApi.CrudSdk, id: string) =>
    pipe(
      sdk.GetGroupProduct({ id }),
      throwIfEmptyValue(`GroupProduct cannot be found: ${id}`),
      shareReplay(1),
    ),
);

export const getGroupProduct =
  (sdk: CrudApi.CrudSdk) =>
  (id: string): Observable<CrudApi.GroupProduct> =>
    getGroupProductHelper(sdk, id);

const getChainProductHelper = R.memoizeWith(
  (_sdk: CrudApi.CrudSdk, id: string) => id,
  (sdk: CrudApi.CrudSdk, id: string) =>
    pipe(
      sdk.GetChainProduct({ id }),
      throwIfEmptyValue(`ChainProduct cannot be found: ${id}`),
      shareReplay(1),
    ),
);

export const getChainProduct =
  (sdk: CrudApi.CrudSdk) =>
  (id: string): Observable<CrudApi.ChainProduct> =>
    getChainProductHelper(sdk, id);

export const getGroupProductOfUnitProduct =
  (sdk: CrudApi.CrudSdk) =>
  (unitProductId: string): Observable<CrudApi.GroupProduct> =>
    pipe(
      getUnitProduct(sdk)(unitProductId),
      switchMap(unitProduct => getGroupProduct(sdk)(unitProduct.parentId)),
    );

const getGeneratedProductHelper = R.memoizeWith(
  (_sdk: CrudApi.CrudSdk, productId: string) => productId,
  (sdk: CrudApi.CrudSdk, productId: string) =>
    pipe(
      sdk.GetGeneratedProduct({ id: productId }),
      throwIfEmptyValue(`GeneratedProduct cannot be found: ${productId}`),
      shareReplay(1),
    ),
);

export const getGeneratedProduct =
  (sdk: CrudApi.CrudSdk) =>
  (productId: string): Observable<CrudApi.GeneratedProduct> =>
    getGeneratedProductHelper(sdk, productId);
