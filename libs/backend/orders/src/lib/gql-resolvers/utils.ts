import * as OE from 'fp-ts-rxjs/lib/ObservableEither';
import { pipe } from 'fp-ts/lib/function';
import * as CrudApi from '@bgap/crud-gql/api';
import * as R from 'ramda';
import { shareReplay } from 'rxjs/operators';
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
      OE.fromPredicate(
        R.complement(R.isNil),
        () => `UnitProduct cannot be found: ${id}`,
      ),
      shareReplay(1),
    ),
);

export const getUnitProduct =
  (sdk: CrudApi.CrudSdk) =>
  (id: string): OE.ObservableEither<string, CrudApi.UnitProduct> =>
    getUnitProductHelper(sdk, id);

const getGroupProductHelper = R.memoizeWith(
  (_sdk: CrudApi.CrudSdk, id: string) => id,
  (sdk: CrudApi.CrudSdk, id: string) =>
    pipe(
      sdk.GetGroupProduct({ id }),
      OE.fromPredicate(
        R.complement(R.isNil),
        () => `GroupProduct cannot be found: ${id}`,
      ),
      shareReplay(1),
    ),
);

export const getGroupProduct =
  (sdk: CrudApi.CrudSdk) =>
  (id: string): OE.ObservableEither<string, CrudApi.GroupProduct> =>
    getGroupProductHelper(sdk, id);

const getChainProductHelper = R.memoizeWith(
  (_sdk: CrudApi.CrudSdk, id: string) => id,
  (sdk: CrudApi.CrudSdk, id: string) =>
    pipe(
      sdk.GetChainProduct({ id }),
      OE.fromPredicate(
        R.complement(R.isNil),
        () => `ChainProduct cannot be found: ${id}`,
      ),
      shareReplay(1),
    ),
);

export const getChainProduct =
  (sdk: CrudApi.CrudSdk) =>
  (id: string): OE.ObservableEither<string, CrudApi.ChainProduct> =>
    getChainProductHelper(sdk, id);

export const getGroupProductOfUnitProduct =
  (sdk: CrudApi.CrudSdk) =>
  (unitProductId: string): OE.ObservableEither<string, CrudApi.GroupProduct> =>
    pipe(
      getUnitProduct(sdk)(unitProductId),
      OE.chain(unitProduct => getGroupProduct(sdk)(unitProduct.parentId)),
    );

const getGeneratedProductHelper = R.memoizeWith(
  (_sdk: CrudApi.CrudSdk, productId: string) => productId,
  (sdk: CrudApi.CrudSdk, productId: string) =>
    pipe(
      sdk.GetGeneratedProduct({ id: productId }),
      OE.fromPredicate(
        R.complement(R.isNil),
        () => `GeneratedProduct cannot be found: ${productId}`,
      ),
      shareReplay(1),
    ),
);

export const getGeneratedProduct =
  (sdk: CrudApi.CrudSdk) =>
  (productId: string): OE.ObservableEither<string, CrudApi.GeneratedProduct> =>
    getGeneratedProductHelper(sdk, productId);

export const getAllParentsOfUnitProduct =
  (sdk: CrudApi.CrudSdk) =>
  (
    unitProductId: string,
  ): OE.ObservableEither<
    string,
    {
      unitProduct: CrudApi.UnitProduct;
      groupProduct: CrudApi.GroupProduct;
      chainProduct: CrudApi.ChainProduct;
    }
  > =>
    pipe(
      getUnitProduct(sdk)(unitProductId),
      OE.chain(unitProduct =>
        pipe(
          getGroupProduct(sdk)(unitProduct.parentId),
          OE.map(groupProduct => ({
            unitProduct,
            groupProduct,
          })),
        ),
      ),
      OE.chain(state =>
        pipe(
          getChainProduct(sdk)(state.groupProduct.parentId),
          OE.map(chainProduct => ({
            ...state,
            chainProduct,
          })),
        ),
      ),
    );
