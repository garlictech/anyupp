import { pipe } from 'fp-ts/lib/function';

import { Observable } from 'rxjs';
import * as R from 'ramda';
import { shareReplay, switchMap } from 'rxjs/operators';
import { throwIfEmptyValue } from '@bgap/shared/utils';
import { AxiosStatic } from 'axios';
import { DynamoDB } from 'aws-sdk';
import { CrudSdk } from '@bgap/crud-gql/api';
import {
  ChainProduct,
  GeneratedProduct,
  GroupProduct,
  UnitProduct,
} from '@bgap/domain';

export interface OrderResolverDeps {
  crudSdk: CrudSdk;
  orderTableName: string;
  unitTableName: string;
  currentTimeISOString: () => string;
  random: () => number;
  uuid: () => string;
  axiosInstance: AxiosStatic;
  docClient: DynamoDB.DocumentClient;
  userId: string;
}

const getUnitProductHelper = R.memoizeWith(
  (_sdk: CrudSdk, id: string) => id,
  (sdk: CrudSdk, id: string) =>
    pipe(
      sdk.GetUnitProduct({ id }),
      throwIfEmptyValue(`UnitProduct cannot be found: ${id}`),
      shareReplay(1),
    ),
);

export const getUnitProduct =
  (sdk: CrudSdk) =>
  (id: string): Observable<UnitProduct> =>
    getUnitProductHelper(sdk, id);

const getGroupProductHelper = R.memoizeWith(
  (_sdk: CrudSdk, id: string) => id,
  (sdk: CrudSdk, id: string) =>
    pipe(
      sdk.GetGroupProduct({ id }),
      throwIfEmptyValue(`GroupProduct cannot be found: ${id}`),
      shareReplay(1),
    ),
);

export const getGroupProduct =
  (sdk: CrudSdk) =>
  (id: string): Observable<GroupProduct> =>
    getGroupProductHelper(sdk, id);

const getChainProductHelper = R.memoizeWith(
  (_sdk: CrudSdk, id: string) => id,
  (sdk: CrudSdk, id: string) =>
    pipe(
      sdk.GetChainProduct({ id }),
      throwIfEmptyValue(`ChainProduct cannot be found: ${id}`),
      shareReplay(1),
    ),
);

export const getChainProduct =
  (sdk: CrudSdk) =>
  (id: string): Observable<ChainProduct> =>
    getChainProductHelper(sdk, id);

export const getGroupProductOfUnitProduct =
  (sdk: CrudSdk) =>
  (unitProductId: string): Observable<GroupProduct> =>
    pipe(
      getUnitProduct(sdk)(unitProductId),
      switchMap(unitProduct => getGroupProduct(sdk)(unitProduct.parentId)),
    );

const getGeneratedProductHelper = R.memoizeWith(
  (_sdk: CrudSdk, productId: string) => productId,
  (sdk: CrudSdk, productId: string) =>
    pipe(
      sdk.GetGeneratedProduct({ id: productId }),
      throwIfEmptyValue(`GeneratedProduct cannot be found: ${productId}`),
      shareReplay(1),
    ),
);

export const getGeneratedProduct =
  (sdk: CrudSdk) =>
  (productId: string): Observable<GeneratedProduct> =>
    getGeneratedProductHelper(sdk, productId);
