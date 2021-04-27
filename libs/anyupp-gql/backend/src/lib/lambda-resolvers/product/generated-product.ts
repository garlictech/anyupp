import * as fp from 'lodash/fp';
import { iif, Observable, of, throwError } from 'rxjs';
import {
  catchError,
  defaultIfEmpty,
  filter,
  map,
  switchMap,
} from 'rxjs/operators';

import { CrudApi, CrudApiQueryDocuments } from '@bgap/crud-gql/api';
import {
  executeQuery,
  GraphqlApiClient,
} from '@bgap/shared/graphql/api-client';
import { IGeneratedProduct } from '@bgap/shared/types';

import {
  executeBatchDelete,
  executeBatchPut,
} from '../../utils/dynamodb.utils';

const TABLE_NAME =
  process.env.generatedProductResourceId ||
  'GeneratedProduct-3vjbjtzr2rhxffhmzbpoo7ozzu-dev';

// export const removeProductFromProductList = async ({
//   unitId,
//   productCategoryId,
//   unitProductId,
// }: {
//   unitId: string;
//   productCategoryId: string;
//   unitProductId: string;
// }) => {
//   await db(fContext).productListProductRef(unitId, productCategoryId, unitProductId).remove();
// };

// export const updateProductInProductList = async ({
//   unitId,
//   unitProductId,
//   mergedProduct,
// }: {
//   unitId: string;
//   unitProductId: string;
//   mergedProduct: MergedProduct;
// }) => {
//   const unitTimeZone = await getTimezoneForUnit(fContext, unitId);
//   const filteredProduct = calculateActualPricesAndCheckActivity({
//       product: mergedProduct,
//       atTimeISO: new Date().toISOString(),
//       inTimeZone: unitTimeZone,
//   });

//   await createFuturePriceUpdateTasks({
//       fContext,
//       unitId,
//       unitProductId,
//       product: mergedProduct,
//       inTimeZone: unitTimeZone,
//   });

//   if (filteredProduct) {
//       await db(fContext)
//           .productListProductRef(unitId, mergedProduct.productCategoryId, unitProductId)
//           .update(filteredProduct);
//   } else {
//       await removeProductFromProductList({
//           fContext,
//           unitId,
//           productCategoryId: mergedProduct.productCategoryId,
//           unitProductId,
//       });
//   }
// };

// export const generateProductListForAUnit = ({
//   input,
//   crudGraphqlClient,
// }: {
//   input: CrudApi.CreateUnitProductInput;
//   crudGraphqlClient: GraphqlApiClient;
// }): Observable<boolean> => {
//   return of(true);
// };

export const deleteGeneratedProductsForAUnit = ({
  unitId,
  crudGraphqlClient,
}: {
  unitId: string;
  crudGraphqlClient: GraphqlApiClient;
}) => {
  return listGeneratedProductsForUnits(crudGraphqlClient, [unitId]).pipe(
    switchMap(items =>
      iif(
        () => items.length > 0,
        of(items).pipe(
          map(generatedProducts => generatedProducts.map(x => x.id)),
          switchMap(executeBatchDelete(TABLE_NAME)),
        ),
        of([]),
      ),
    ),
  );
};

export const createGeneratedProducts = ({
  products,
}: // crudGraphqlClient,
{
  products: CrudApi.CreateGeneratedProductInput[];
  // crudGraphqlClient: GraphqlApiClient;
}) => {
  return executeBatchPut(TABLE_NAME)(products);
  // return listGeneratedProductsForUnits(crudGraphqlClient, [unitId]).pipe(
  //   map(generatedProducts => generatedProducts.map(x => x.id)),
  //   // switchMap(executeBatchDelete('GeneratedProductTable')),
  //   switchMap(executeBatchDelete(TABLE_NAME)),
  // );
};

export const listGeneratedProductsForUnits = (
  crudGraphqlClient: GraphqlApiClient,
  unitIds: Array<string>,
): Observable<Array<IGeneratedProduct>> => {
  const input: CrudApi.ListGeneratedProductsQueryVariables = {
    filter: { or: unitIds.map(x => ({ unitId: { eq: x } })) },
  };
  return executeQuery(crudGraphqlClient)<CrudApi.ListGeneratedProductsQuery>(
    CrudApiQueryDocuments.listGeneratedProducts,
    input,
  ).pipe(
    map(x => x.listGeneratedProducts?.items),
    filter(fp.negate(fp.isEmpty)),
    defaultIfEmpty([]),
    // TODO: switchMap((items: []) => combineLatest(items.map(validateUnit))),
    catchError(err => {
      console.error(err);
      return throwError('Internal listGeneratedProducts query error');
    }),
  );
};
