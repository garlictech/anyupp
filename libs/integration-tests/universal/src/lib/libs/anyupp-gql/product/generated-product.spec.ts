import {
  createGeneratedProducts,
  deleteGeneratedProductsForAUnit,
  listGeneratedProductsForUnits,
} from '@bgap/anyupp-gql/backend';
import { getSortedIds } from '@bgap/shared/utils';
import { combineLatest, of } from 'rxjs';
import { scan, switchMap, tap, delay } from 'rxjs/operators';
import { generatedProductSeed, testIdPrefix } from '@bgap/shared/fixtures';
import {
  createTestGeneratedProduct,
  deleteTestGeneratedProduct,
} from '../../../seeds/generated-product';
import { createIamCrudSdk } from 'libs/integration-tests/universal/src/api-clients';

const TEST_NAME = 'BATCH_';

const unitId_01 = `${TEST_NAME}UNIT_ID_01`;
const unitId_02 = `${TEST_NAME}UNIT_ID_02`;
const unitId_03 = `${TEST_NAME}UNIT_ID_03`;
const unit01_generatedProduct_01 = {
  ...generatedProductSeed.base,
  id: `${testIdPrefix}${TEST_NAME}generatedProduct_u${unitId_01}_01`,
  unitId: unitId_01,
};
const unit02_generatedProduct_01 = {
  ...generatedProductSeed.base,
  id: `${testIdPrefix}generatedProduct_u${unitId_02}_01`,
  unitId: unitId_02,
};
const unit03_generatedProduct_01 = {
  ...generatedProductSeed.base,
  id: `${testIdPrefix}generatedProduct_u${unitId_03}_01`,
  unitId: unitId_03,
};
const unit03_generatedProduct_02 = {
  ...generatedProductSeed.base,
  id: `${testIdPrefix}generatedProduct_u${unitId_03}_02`,
  unitId: unitId_03,
};

const DYNAMODB_OPERATION_DELAY = 3000;
const PRODUCT_NUM_FOR_BATCH_CRUD = 26; // should be > 25 because the batchSize is 25
const productIds = [...Array(PRODUCT_NUM_FOR_BATCH_CRUD).keys()]
  .map(id => id.toString().padStart(2, '0'))
  .map(id => `${testIdPrefix}${TEST_NAME}ID_${id}`);

describe('GenerateProduct tests', () => {
  const deps = {
    crudSdk: createIamCrudSdk(),
  };

  it('should NOT the deleteGeneratedProductsForAUnit complete the stream without any item to delete', done => {
    deleteGeneratedProductsForAUnit(
      'WONT_BE_THERE_ANY_GENERATED_PROD_WITH_THIS_UNITID_FOR_SURE',
    )(deps).subscribe({
      next() {
        // SHOULD NOT TIMEOUT so this next callback should be triggered
        done();
      },
    });
  });

  describe('complex tests', () => {
    beforeAll(async () => {
      await of('START')
        .pipe(
          // CleanUP
          switchMap(() =>
            deleteTestGeneratedProduct(
              unit02_generatedProduct_01.id,
              deps.crudSdk,
            ),
          ),
          switchMap(() => deleteGeneratedProductsForAUnit(unitId_01)(deps)),
          switchMap(() => deleteGeneratedProductsForAUnit(unitId_03)(deps)),
          delay(DYNAMODB_OPERATION_DELAY),
          // Seeding
          switchMap(() => {
            return combineLatest([
              createTestGeneratedProduct(
                unit02_generatedProduct_01,
                deps.crudSdk,
              ),
            ]);
          }),
          delay(DYNAMODB_OPERATION_DELAY),
        )
        .toPromise();
    }, 25000);

    it('should be able to create and delete all the given products LESS then 25', done => {
      // using UNIT 03
      of('CREATE_&_DELETE_LESS_THAN_25_ITEMS')
        .pipe(
          // CREATE
          switchMap(() =>
            createGeneratedProducts([
              unit03_generatedProduct_01,
              unit03_generatedProduct_02,
            ]),
          ),
          delay(DYNAMODB_OPERATION_DELAY),
          switchMap(() => listGeneratedProductsForUnits([unitId_03])(deps)),
          tap({
            next(result) {
              expect(getSortedIds(result)).toEqual([
                unit03_generatedProduct_01.id,
                unit03_generatedProduct_02.id,
              ]);
            },
          }),
          delay(DYNAMODB_OPERATION_DELAY),
          // DELETE
          switchMap(() =>
            deleteGeneratedProductsForAUnit(unit03_generatedProduct_01.unitId)(
              deps,
            ),
          ),
          delay(DYNAMODB_OPERATION_DELAY),
          switchMap(() =>
            listGeneratedProductsForUnits([unitId_02, unitId_03])(deps),
          ),
          tap({
            next(result) {
              expect(result.length).toEqual(1);
              expect(getSortedIds(result)).toEqual([
                unit02_generatedProduct_01.id,
              ]);
            },
          }),
        )
        .subscribe({
          next() {
            done();
          },
          error(err) {
            console.error(`${TEST_NAME}Test ERROR`, err);
          },
        });
    }, 25000);

    it('should be able to create and delete MORE then 25 generated products', done => {
      // using UNIT 01
      const fullProducts = productIds.map(id => ({
        ...unit01_generatedProduct_01,
        id,
      }));

      expect(productIds).toHaveLength(PRODUCT_NUM_FOR_BATCH_CRUD);
      expect(fullProducts).toHaveLength(productIds.length);

      // CREATE_&_DELETE_MORE_THAN_25_ITEMS
      of(fullProducts)
        .pipe(
          // CREATE
          switchMap(createGeneratedProducts),
          // Count the emission number
          scan((acc: number) => acc + 1, 0),
          tap({
            next(emissionCount) {
              // The whole buffered batch operation should only emit one result
              // at the end of the very last db operation
              expect(emissionCount).toEqual(1);
            },
          }),
          delay(DYNAMODB_OPERATION_DELAY),
          switchMap(() => listGeneratedProductsForUnits([unitId_01])(deps)),
          tap({
            next(result) {
              expect(getSortedIds(result)).toEqual(productIds);
              expect(result).toHaveLength(fullProducts.length);
            },
          }),
          delay(DYNAMODB_OPERATION_DELAY),
          // DELETE
          switchMap(() => deleteGeneratedProductsForAUnit(unitId_01)(deps)),
          delay(DYNAMODB_OPERATION_DELAY),
          switchMap(() =>
            listGeneratedProductsForUnits([unitId_01, unitId_02])(deps),
          ),
          tap({
            // should delete all the generatedProducts for the unit01
            next(result) {
              expect(result.length).toEqual(1);
              expect(getSortedIds(result)).toEqual([
                unit02_generatedProduct_01.id,
              ]);
            },
          }),
        )
        .subscribe({
          next() {
            done();
          },
          error(err) {
            console.error(`${TEST_NAME}Test ERROR`, err);
          },
        });
    }, 25000);
  });
});
