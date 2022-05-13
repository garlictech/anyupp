import { generatedProductFixture, testIdPrefix } from '@bgap/shared/fixtures';
import { getSortedIds } from '@bgap/shared/utils';
import {
  createGeneratedProductsInDb,
  deleteGeneratedProductsForAUnitFromDb,
  listGeneratedProductsForUnits,
} from '@bgap/backend/products';
import { combineLatest, of } from 'rxjs';
import { delay, scan, switchMap, tap } from 'rxjs/operators';
import { createIamCrudSdk } from '../../../../api-clients';
import {
  createTestGeneratedProduct,
  deleteTestGeneratedProduct,
} from '../../../seeds/generated-product';

const TEST_NAME = 'BATCH_';

const unitId_01 = `${TEST_NAME}UNIT_ID_01`;
const unitId_02 = `${TEST_NAME}UNIT_ID_02`;
const unitId_03 = `${TEST_NAME}UNIT_ID_03`;
const unit01_generatedProduct_01 = {
  ...generatedProductFixture.base,
  id: `${testIdPrefix}${TEST_NAME}generatedProduct_u${unitId_01}_01`,
  unitId: unitId_01,
};
const unit02_generatedProduct_01 = {
  ...generatedProductFixture.base,
  id: `${testIdPrefix}generatedProduct_u${unitId_02}_01`,
  unitId: unitId_02,
};
const unit03_generatedProduct_01 = {
  ...generatedProductFixture.base,
  id: `${testIdPrefix}generatedProduct_u${unitId_03}_01`,
  unitId: unitId_03,
};
const unit03_generatedProduct_02 = {
  ...generatedProductFixture.base,
  id: `${testIdPrefix}generatedProduct_u${unitId_03}_02`,
  unitId: unitId_03,
};

const DYNAMODB_OPERATION_DELAY = 3000;
const PRODUCT_NUM_FOR_BATCH_CRUD = 26; // should be > 25 because the batchSize is 25
const productIds = [...Array(PRODUCT_NUM_FOR_BATCH_CRUD).keys()]
  .map(id => id.toString().padStart(2, '0'))
  .map(id => `${testIdPrefix}${TEST_NAME}ID_${id}`);

describe.skip('GenerateProduct tests', () => {
  const crudSdk = createIamCrudSdk();

  it('should NOT the deleteGeneratedProductsForAUnit complete the stream without any item to delete', done => {
    deleteGeneratedProductsForAUnitFromDb(crudSdk)(
      'WONT_BE_THERE_ANY_GENERATED_PROD_WITH_THIS_UNITID_FOR_SURE',
    ).subscribe({
      next() {
        // SHOULD NOT TIMEOUT so this next callback should be triggered
        done();
      },
    });
  }, 60000);

  describe('complex tests', () => {
    const cleanup = () =>
      of('cleanup').pipe(
        // CleanUP
        switchMap(() =>
          deleteTestGeneratedProduct(unit02_generatedProduct_01.id, crudSdk),
        ),
        switchMap(() =>
          deleteGeneratedProductsForAUnitFromDb(crudSdk)(unitId_01),
        ),
        switchMap(() =>
          deleteGeneratedProductsForAUnitFromDb(crudSdk)(unitId_03),
        ),
      );

    beforeAll(async () => {
      await cleanup()
        .pipe(
          delay(DYNAMODB_OPERATION_DELAY),
          // Seeding
          switchMap(() => {
            return combineLatest([
              createTestGeneratedProduct(unit02_generatedProduct_01, crudSdk),
            ]);
          }),
          delay(DYNAMODB_OPERATION_DELAY),
        )
        .toPromise();
    }, 100000);

    afterAll(async () => {
      await cleanup().toPromise();
    }, 60000);

    it('should be able to create and delete all the given products LESS then 25', done => {
      // using UNIT 03
      of('CREATE_&_DELETE_LESS_THAN_25_ITEMS')
        .pipe(
          // CREATE
          switchMap(() =>
            createGeneratedProductsInDb([
              unit03_generatedProduct_01,
              unit03_generatedProduct_02,
            ]),
          ),
          delay(DYNAMODB_OPERATION_DELAY),
          switchMap(() => listGeneratedProductsForUnits(crudSdk)([unitId_03])),
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
            deleteGeneratedProductsForAUnitFromDb(crudSdk)(
              unit03_generatedProduct_01.unitId,
            ),
          ),
          delay(DYNAMODB_OPERATION_DELAY),
          switchMap(() =>
            listGeneratedProductsForUnits(crudSdk)([unitId_02, unitId_03]),
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
    }, 100000);

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
          switchMap(createGeneratedProductsInDb),
          // Count the emission number
          scan((acc: number) => acc + 1, 0),
          tap({
            next(emissionCount) {
              // The whole buffered batch operation should only emit one result
              // at the end of the very last db operation
              expect(emissionCount).toEqual(1);
            },
          }),
          // bigger delay, to let elastic search index the new items
          delay(10000),
          switchMap(() => listGeneratedProductsForUnits(crudSdk)([unitId_01])),
          tap({
            next(result) {
              expect(getSortedIds(result)).toEqual(productIds);
              expect(result).toHaveLength(fullProducts.length);
            },
          }),
          delay(DYNAMODB_OPERATION_DELAY),
          // DELETE
          switchMap(() =>
            deleteGeneratedProductsForAUnitFromDb(crudSdk)(unitId_01),
          ),
          delay(DYNAMODB_OPERATION_DELAY),
          switchMap(() =>
            listGeneratedProductsForUnits(crudSdk)([unitId_01, unitId_02]),
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
    }, 100000);
  });
});
