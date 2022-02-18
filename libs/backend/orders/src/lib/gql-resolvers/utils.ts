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
      x =>
        OE.tryCatch(x) as OE.ObservableEither<
          string,
          CrudApi.UnitProduct | undefined | null
        >,
      OE.chain(
        OE.fromPredicate(
          x => !!x,
          () => `UnitProduct cannot be found: ${id}`,
        ),
      ),
      OE.map(x => x as NonNullable<typeof x>),
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
      x =>
        OE.tryCatch(x) as OE.ObservableEither<
          string,
          CrudApi.GroupProduct | undefined | null
        >,
      OE.chain(
        OE.fromPredicate(
          x => !!x,
          () => `GroupProduct cannot be found: ${id}`,
        ),
      ),
      OE.map(x => x as NonNullable<typeof x>),
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
      x =>
        OE.tryCatch(x) as OE.ObservableEither<
          string,
          CrudApi.ChainProduct | undefined | null
        >,
      OE.chain(
        OE.fromPredicate(
          x => !!x,
          () => `ChainProduct cannot be found: ${id}`,
        ),
      ),
      OE.map(x => x as NonNullable<typeof x>),
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
      x =>
        OE.tryCatch(x) as OE.ObservableEither<
          string,
          CrudApi.GeneratedProduct | undefined | null
        >,
      OE.chain(
        OE.fromPredicate(
          x => !!x,
          () => `GeneratedProduct cannot be found: ${productId}`,
        ),
      ),
      OE.map(x => x as NonNullable<typeof x>),
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
