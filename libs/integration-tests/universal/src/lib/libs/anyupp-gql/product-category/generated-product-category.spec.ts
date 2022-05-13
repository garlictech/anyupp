import * as CrudApi from '@bgap/crud-gql/api';
import {
  generatedProductCategoryFixture,
  generatedProductFixture,
  productCategoryFixture,
  testIdPrefix,
} from '@bgap/shared/fixtures';
import { RequiredId } from '@bgap/shared/types';
import { sortById } from '@bgap/shared/utils';
import {
  deleteGeneratedProductCategoriesForAUnit,
  listGeneratedProductCategoriesForUnits,
  reGenerateActiveProductCategoriesForAUnit,
} from '@bgap/backend/product-categories';
import { of } from 'rxjs';
import { delay, map, switchMap, tap } from 'rxjs/operators';
import { createIamCrudSdk } from '../../../../api-clients';
import { getSortedProductCatIds } from '../test-utils/test-utils';

const DYNAMODB_OPERATION_DELAY = 3000;
const TEST_NAME = 'GEN_PRODUCT_CAT';

const unitId = `${testIdPrefix}${TEST_NAME}_UNIT_ID`;

const productCategory_01: RequiredId<CrudApi.CreateProductCategoryInput> = {
  ...productCategoryFixture.productCategoryBase,
  id: `${testIdPrefix}${TEST_NAME}_01`,
};
const productCategory_02: RequiredId<CrudApi.CreateProductCategoryInput> = {
  ...productCategoryFixture.productCategoryBase,
  id: `${testIdPrefix}${TEST_NAME}_02`,
};
const productCategory_03_wont_be_regenerated: RequiredId<CrudApi.CreateProductCategoryInput> =
  {
    ...productCategoryFixture.productCategoryBase,
    id: `${testIdPrefix}${TEST_NAME}_03_WONT_BE_REGENERATED`,
  };
const productCategory_04: RequiredId<CrudApi.CreateProductCategoryInput> = {
  ...productCategoryFixture.productCategoryBase,
  id: `${testIdPrefix}${TEST_NAME}_04`,
};
const generatedProductCategory_03_wont_be_regenerated =
  generatedProductCategoryFixture.getGeneratedProductCategory(
    // because productNum === 0
    {
      id: productCategory_03_wont_be_regenerated.id, // THE id and the productCategoryId is not equal but in this test case it is NOT important
      unitId,
      productCategoryId: productCategory_03_wont_be_regenerated.id,
    },
  );

// const PRODUCT_NUM_FOR_BATCH_CRUD = 26; // should be > 25 because the batchSize is 25
// const productIds = [...Array(PRODUCT_NUM_FOR_BATCH_CRUD).keys()]
//   .map(id => id.toString().padStart(2, '0'))
//   .map(id => `${testIdPrefix}${TEST_NAME}ID_${id}`);

const generatedProducts: Array<CrudApi.CreateGeneratedProductInput> = [
  generatedProductFixture.getGeneratedProduct({
    id: 'NotImportant',
    unitId,
    productCategoryId: productCategory_01.id,
  }),
  generatedProductFixture.getGeneratedProduct({
    id: 'NotImportant',
    unitId,
    productCategoryId: productCategory_02.id,
  }),
  generatedProductFixture.getGeneratedProduct({
    id: 'NotImportant',
    unitId,
    productCategoryId: productCategory_02.id,
  }),
  generatedProductFixture.getGeneratedProduct({
    id: 'NotImportant',
    unitId,
    productCategoryId: productCategory_02.id,
  }),
  generatedProductFixture.getGeneratedProduct({
    id: 'NotImportant',
    unitId,
    productCategoryId: productCategory_02.id,
  }),
  generatedProductFixture.getGeneratedProduct({
    id: 'NotImportant',
    unitId,
    productCategoryId: productCategory_02.id,
  }),
  generatedProductFixture.getGeneratedProduct({
    id: 'NotImportant',
    unitId,
    productCategoryId: productCategory_04.id,
  }),
  generatedProductFixture.getGeneratedProduct({
    id: 'NotImportant',
    unitId,
    productCategoryId: productCategory_04.id,
  }),
];

describe('GenerateProductCategory tests', () => {
  const deps = {
    crudSdk: createIamCrudSdk(),
  };

  // it('should NOT fail without any product as Input', done => {
  //   reGenerateActiveProductCategoriesForAUnit(deps)([]).subscribe({
  //     next() {
  //       // SHOULD NOT TIMEOUT so this next callback should be triggered
  //       done();
  //     },
  //   });
  // });

  describe('complex tests', () => {
    const cleanup = () =>
      of('cleanup').pipe(
        // CleanUP
        switchMap(() => deleteGeneratedProductCategoriesForAUnit(deps)(unitId)),
        switchMap(() =>
          deps.crudSdk.DeleteProductCategory({
            input: { id: productCategory_01.id },
          }),
        ),
        switchMap(() =>
          deps.crudSdk.DeleteProductCategory({
            input: { id: productCategory_02.id },
          }),
        ),
        switchMap(() =>
          deps.crudSdk.DeleteProductCategory({
            input: { id: productCategory_03_wont_be_regenerated.id },
          }),
        ),
        switchMap(() =>
          deps.crudSdk.DeleteProductCategory({
            input: { id: productCategory_04.id },
          }),
        ),
      );

    beforeEach(async () => {
      await cleanup()
        .pipe(
          delay(DYNAMODB_OPERATION_DELAY),
          // Seeding
          switchMap(() =>
            deps.crudSdk.CreateProductCategory({
              input: productCategory_01,
            }),
          ),
          switchMap(() =>
            deps.crudSdk.CreateProductCategory({
              input: productCategory_02,
            }),
          ),
          switchMap(() =>
            deps.crudSdk.CreateProductCategory({
              input: productCategory_03_wont_be_regenerated,
            }),
          ),
          switchMap(() =>
            deps.crudSdk.CreateProductCategory({
              input: productCategory_04,
            }),
          ),
          // CREATE one PRE existing generated Product Category that won't be regenerated, so it should be deleted during the process
          switchMap(() =>
            deps.crudSdk.CreateGeneratedProductCategory({
              input: generatedProductCategory_03_wont_be_regenerated,
            }),
          ),
          delay(DYNAMODB_OPERATION_DELAY),
        )
        .toPromise();
    }, 25000);

    afterAll(() => cleanup().toPromise(), 15000);

    const startStateCheck = () =>
      of('GENERATE_PRODUCT_CATEGORIES').pipe(
        switchMap(() => listGeneratedProductCategoriesForUnits(deps)([unitId])),
        tap({
          next(result) {
            // ONLY THE PRECREATED GEN_CATEGORY SHOULD EXIST
            expect(getSortedProductCatIds(result)).toEqual([
              productCategory_03_wont_be_regenerated.id,
            ]);
          },
        }),
        delay(DYNAMODB_OPERATION_DELAY),
      );

    it('should generate the given product Categories with correct productNums or clear all in case the input is empty', done => {
      startStateCheck()
        .pipe(
          // PHASE 1: the pre existing 3. should be deleted and the new 1, 2, 4, should be generated with proper productNums
          switchMap(() =>
            reGenerateActiveProductCategoriesForAUnit(deps)({
              unitId,
              generatedProducts,
            }),
          ),
          delay(DYNAMODB_OPERATION_DELAY),
          switchMap(() =>
            listGeneratedProductCategoriesForUnits(deps)([unitId]),
          ),
          map(sortById),
          tap({
            next(result) {
              // ONLY THE PRECREATED GENCATEGORY SHOULD EXIST
              expect(getSortedProductCatIds(result)).toEqual([
                productCategory_01.id,
                productCategory_02.id,
                productCategory_04.id,
              ]);
              expect(result[0].productCategoryId).toEqual(
                productCategory_01.id,
              );
              expect(result[0].productNum).toEqual(1);
              expect(result[1].productCategoryId).toEqual(
                productCategory_02.id,
              );
              expect(result[1].productNum).toEqual(5);
              expect(result[2].productCategoryId).toEqual(
                productCategory_04.id,
              );
              expect(result[2].productNum).toEqual(2);
              expect(result[0]).toMatchSnapshot(
                {
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                  productCategory: {
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                  },
                },
                'A Generated ProductCategory',
              );
            },
          }),
          // PHASE 2: in case of an empty array as input all the existing generatedProductCategories should be deleted for the unit
          switchMap(() =>
            reGenerateActiveProductCategoriesForAUnit(deps)({
              unitId,
              generatedProducts: [],
            }),
          ),
          delay(DYNAMODB_OPERATION_DELAY),
          switchMap(() =>
            listGeneratedProductCategoriesForUnits(deps)([unitId]),
          ),
          tap({
            next(result) {
              expect(getSortedProductCatIds(result)).toEqual([]);
            },
          }),
        )
        .subscribe({
          next() {
            // SHOULD NOT TIMEOUT so this next callback should be triggered
            done();
          },
          error(err) {
            console.error(`${TEST_NAME}Test ERROR`, err);
          },
        });
    }, 60000);
  });
});
