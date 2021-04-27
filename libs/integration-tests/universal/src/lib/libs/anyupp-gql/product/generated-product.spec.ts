import {
  createGeneratedProducts,
  deleteGeneratedProductsForAUnit,
  listGeneratedProductsForUnits,
} from '@bgap/anyupp-gql/backend';
import { crudBackendGraphQLClient } from '@bgap/shared/graphql/api-client';
import { getSortedIds } from '@bgap/shared/utils';
import { combineLatest, of } from 'rxjs';
import { scan, switchMap, tap } from 'rxjs/operators';
import { generatedProductSeed } from '@bgap/shared/fixtures';
import {
  createTestGeneratedProduct,
  deleteTestGeneratedProduct,
} from '../../../seeds/generated-product';

const unitId_01 = 'UNIT_ID_01';
const unitId_02 = 'UNIT_ID_02';
const unitId_03 = 'UNIT_ID_03';
const unit01_generatedProduct_01 = {
  ...generatedProductSeed.base,
  id: `generatedProduct_u${unitId_01}_01`,
  unitId: unitId_01,
};
const unit02_generatedProduct_01 = {
  ...generatedProductSeed.base,
  id: `generatedProduct_u${unitId_02}_01`,
  unitId: unitId_02,
};
const unit03_generatedProduct_01 = {
  ...generatedProductSeed.base,
  id: `generatedProduct_u${unitId_03}_01`,
  unitId: unitId_03,
};
const unit03_generatedProduct_02 = {
  ...generatedProductSeed.base,
  id: `generatedProduct_u${unitId_03}_02`,
  unitId: unitId_03,
};

const PRODUCT_NUM_FOR_BATCH_CRUD = 99;
const productIds = [...Array(PRODUCT_NUM_FOR_BATCH_CRUD).keys()]
  .map(id => id.toString().padStart(2, '0'))
  .map(id => `ID_${id}`);

describe('GenerateProduct tests', () => {
  beforeAll(async () => {
    await combineLatest([
      // CleanUP
      deleteTestGeneratedProduct(unit02_generatedProduct_01.id),
    ])
      .pipe(
        switchMap(() =>
          // Seeding
          combineLatest([
            createTestGeneratedProduct(unit02_generatedProduct_01),
          ]),
        ),
      )
      .toPromise();
  }, 25000);

  it('should be able to create and delete all the given products LESS then 25', done => {
    // using UNIT 03
    of('CREATE_&_DELETE_LESS_THAN_25_ITEMS')
      .pipe(
        // CREATE
        switchMap(() =>
          createGeneratedProducts({
            products: [unit03_generatedProduct_01, unit03_generatedProduct_02],
          }),
        ),
        switchMap(() =>
          listGeneratedProductsForUnits(crudBackendGraphQLClient, [unitId_03]),
        ),
        tap({
          next(result) {
            expect(getSortedIds(result)).toEqual([
              unit03_generatedProduct_01.id,
              unit03_generatedProduct_02.id,
            ]);
          },
        }),
        // DELETE
        switchMap(() =>
          deleteGeneratedProductsForAUnit({
            unitId: unitId_03,
            crudGraphqlClient: crudBackendGraphQLClient,
          }),
        ),
        switchMap(() =>
          listGeneratedProductsForUnits(crudBackendGraphQLClient, [
            unitId_02,
            unitId_03,
          ]),
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

    of('CREATE_&_DELETE_MORE_THAN_25_ITEMS')
      .pipe(
        // CREATE
        switchMap(() =>
          createGeneratedProducts({
            products: fullProducts,
          }),
        ),
        // Count the emission number
        scan((acc: number) => acc + 1, 0),
        tap({
          next(emissionCount) {
            // The whole buffered batch operation should only emit one result
            // at the end of the very last db operation
            expect(emissionCount).toEqual(1);
          },
        }),
        switchMap(() =>
          listGeneratedProductsForUnits(crudBackendGraphQLClient, [unitId_01]),
        ),
        tap({
          next(result) {
            expect(getSortedIds(result)).toEqual(productIds);
            expect(result).toHaveLength(fullProducts.length);
            expect(result[0]).toHaveProperty('__typename', 'GeneratedProduct');
          },
        }),
        // DELETE
        switchMap(() =>
          deleteGeneratedProductsForAUnit({
            unitId: unitId_01,
            crudGraphqlClient: crudBackendGraphQLClient,
          }),
        ),
        switchMap(() =>
          listGeneratedProductsForUnits(crudBackendGraphQLClient, [
            unitId_01,
            unitId_02,
          ]),
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
      });
  }, 25000);
});
