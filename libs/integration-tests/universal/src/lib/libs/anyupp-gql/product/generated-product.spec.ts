import {
  createGeneratedProducts,
  deleteGeneratedProductsForAUnit,
  listGeneratedProductsForUnits,
} from '@bgap/anyupp-gql/backend';
import { crudBackendGraphQLClient } from '@bgap/shared/graphql/api-client';
import { getSortedIds } from '@bgap/shared/utils';
import { combineLatest, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { generatedProductSeed } from '@bgap/shared/fixtures';
import {
  createTestGeneratedProduct,
  deleteTestGeneratedProduct,
} from '../../../seeds/generated-product';

const unitId_01 = 'UNIT_ID_01';
const unitId_02 = 'UNIT_ID_02';
const unit01_generatedProduct_01 = {
  ...generatedProductSeed.base,
  id: `generatedProduct_u${unitId_01}_01`,
  unitId: unitId_01,
};
const unit01_generatedProduct_02 = {
  ...generatedProductSeed.base,
  id: `generatedProduct_u${unitId_01}_02`,
  unitId: unitId_01,
};
const unit02_generatedProduct_01 = {
  ...generatedProductSeed.base,
  id: `generatedProduct_u${unitId_02}_01`,
  unitId: unitId_02,
};

const { id, ...unit01_generatedProduct_WITHOUTID } = unit01_generatedProduct_01;

describe('GenerateProduct tests', () => {
  beforeAll(async () => {
    // authHelper = await createAuthenticatedAnyuppGraphQLClient(
    //   testAdminUsername,
    //   testAdminUserPassword,
    // ).toPromise();
    // console.warn(authHelper.userAttributes);

    await combineLatest([
      // CleanUP
      // // generated
      // deleteTestGeneratedProduct(unit01_generatedProduct_01.id),
      // deleteTestGeneratedProduct(unit01_generatedProduct_02.id),
      deleteTestGeneratedProduct(unit02_generatedProduct_01.id),
    ])
      .pipe(
        switchMap(() =>
          // Seeding
          combineLatest([
            // createTestGeneratedProduct(unit01_generatedProduct_01),
            // createTestGeneratedProduct(unit01_generatedProduct_02),
            createTestGeneratedProduct(unit02_generatedProduct_01),
          ]),
        ),
      )
      .toPromise();
  }, 25000);

  // describe('generateProductListForAUnit function', () => {
  //   it('should generate all the products in the db', done => {
  //     generateProductListForAUnit({});
  //   }, 15000);
  // });

  it('should be able to create and delete all the given products LESS then 25', done => {
    of('CREATE_&_DELETE_LESS_THAN_25_ITEMS')
      .pipe(
        // CREATE
        switchMap(() =>
          createGeneratedProducts({
            products: [unit01_generatedProduct_01, unit01_generatedProduct_02],
          }),
        ),
        switchMap(() =>
          listGeneratedProductsForUnits(crudBackendGraphQLClient, [unitId_01]),
        ),
        tap({
          next(result) {
            expect(getSortedIds(result)).toEqual([
              unit01_generatedProduct_01.id,
              unit01_generatedProduct_02.id,
            ]);
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
