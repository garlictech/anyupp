import * as CrudApi from '@bgap/crud-gql/api';
import { tableConfig } from '@bgap/crud-gql/backend';
import { validateGeneratedProductCategoryList } from '@bgap/shared/data-validators';
import { filterNullishGraphqlListWithDefault } from 'libs/shared/utils/src';
import { defer, iif, Observable, of } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';
import { createItems, deleteItems } from '../../database';
import { ProductCategoryResolverDeps } from './utils';

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
    generatedProducts: Array<CrudApi.CreateGeneratedProductInput>;
  }) => {
    // if (!generatedProducts) {
    //   return of(true);
    // }

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
            mapTo(true),
          ),
          of(true),
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
}): Array<CrudApi.CreateGeneratedProductCategoryInput> =>
  Object.entries(productCategoryMap).map(([productCategoryId, productNum]) => ({
    id: `${unitId}__${productCategoryId}`,
    unitId,
    productCategoryId,
    productNum,
  }));

export const getProductNumberMap = (
  // generatedProducts: CrudApi.CreateGeneratedProductInput[],
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
  items: Required<CrudApi.GeneratedProductCategory>[],
) => deleteItems(TABLE_NAME)(items);

export const createGeneratedProductCategoriesInDb = (
  items: CrudApi.CreateGeneratedProductCategoryInput[],
) => {
  return createItems(TABLE_NAME)(items);
};

export const listGeneratedProductCategoriesForUnits =
  (deps: ProductCategoryResolverDeps) =>
  (unitIds: string[]): Observable<Array<CrudApi.GeneratedProductCategory>> => {
    const input: CrudApi.ListGeneratedProductCategorysQueryVariables = {
      filter: { or: unitIds.map(x => ({ unitId: { eq: x } })) },
      limit: 200, // TODO <==??????????
    };

    return defer(() =>
      deps.crudSdk.ListGeneratedProductCategorys(input, {
        fetchPolicy: 'no-cache',
      }),
    ).pipe(
      switchMap(validateGeneratedProductCategoryList),
      filterNullishGraphqlListWithDefault<CrudApi.GeneratedProductCategory>([]),
    );
  };
