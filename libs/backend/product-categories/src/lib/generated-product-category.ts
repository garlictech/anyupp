import { getAllPaginatedData } from '@bgap/gql-sdk';

import { tableConfig } from '@bgap/crud-gql/backend';
import {
  filterNullishElements,
  filterNullishGraphqlListWithDefault,
} from '@bgap/shared/utils';
import { iif, Observable, of } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';
import { createItems, deleteItems } from '@bgap/anyupp-backend-lib';
import { ProductCategoryResolverDeps } from './utils';
import {
  CreateGeneratedProductCategoryInput,
  CreateGeneratedProductInput,
  GeneratedProductCategory,
  SearchGeneratedProductCategoriesQueryVariables,
} from '@bgap/domain';

interface ProductCategoryMap {
  [key: string]: number;
}

export const reGenerateActiveProductCategoriesForAUnit =
  (deps: ProductCategoryResolverDeps) =>
  ({
    unitId,
    generatedProducts,
  }: {
    unitId: string;
    generatedProducts: Array<CreateGeneratedProductInput>;
  }): Observable<string[]> => {
    return of(unitId).pipe(
      switchMap(deleteGeneratedProductCategoriesForAUnit(deps)),
      mapTo(generatedProducts),
      switchMap(generatedProducts =>
        iif(
          () => generatedProducts.length > 0,
          of(generatedProducts).pipe(
            map(getProductNumberMap),
            map(productCategoryMap => ({ productCategoryMap, unitId })),
            map(fromProductCategoryMapToGeneratedProductCategoryInput),
            switchMap(createGeneratedProductCategoriesInDb),
            map(() => generatedProducts.map(prop => prop.id)),
            filterNullishElements(),
          ),
          of([]),
        ),
      ),
    );
  };

const fromProductCategoryMapToGeneratedProductCategoryInput = ({
  unitId,
  productCategoryMap,
}: {
  unitId: string;
  productCategoryMap: ProductCategoryMap;
}): Array<CreateGeneratedProductCategoryInput> =>
  Object.entries(productCategoryMap).map(([productCategoryId, productNum]) => ({
    id: `${unitId}__${productCategoryId}`,
    unitId,
    productCategoryId,
    productNum,
  }));

export const getProductNumberMap = (
  // generatedProducts: CreateGeneratedProductInput[],
  productsWithProductCategories: Array<{ productCategoryId: string }>,
): ProductCategoryMap =>
  productsWithProductCategories.reduce(
    (prev, curr) => ({
      ...prev,
      [curr.productCategoryId]: (prev[curr.productCategoryId] || 0) + 1,
    }),
    <ProductCategoryMap>{},
  );

// export const updateProductNumOnProductCategory = () => {};

const TABLE_NAME = tableConfig.GeneratedProductCategory.TableName;

export const deleteGeneratedProductCategoriesForAUnit =
  (deps: ProductCategoryResolverDeps) => (unitId: string) => {
    return listGeneratedProductCategoriesForUnits(deps)([unitId]).pipe(
      switchMap(items =>
        iif(
          () => items.length > 0,
          deleteGeneratedProductCategoryItemsFromDb(items),
          of([]),
        ),
      ),
    );
  };
const deleteGeneratedProductCategoryItemsFromDb = (
  items: Required<GeneratedProductCategory>[],
) => deleteItems(TABLE_NAME)(items);

export const createGeneratedProductCategoriesInDb = (
  items: CreateGeneratedProductCategoryInput[],
) => {
  return createItems(TABLE_NAME)(items);
};

export const listGeneratedProductCategoriesForUnits =
  (deps: ProductCategoryResolverDeps) =>
  (unitIds: string[]): Observable<Array<GeneratedProductCategory>> => {
    const input: SearchGeneratedProductCategoriesQueryVariables = {
      filter: { or: unitIds.map(x => ({ unitId: { eq: x } })) },
      limit: 200, // DO NOT USE FIX limit (Covered by #472)
    };

    return getAllPaginatedData(deps.crudSdk.SearchGeneratedProductCategories, {
      query: input,
      options: {
        fetchPolicy: 'no-cache',
      },
    }).pipe(filterNullishGraphqlListWithDefault<GeneratedProductCategory>([]));
  };
