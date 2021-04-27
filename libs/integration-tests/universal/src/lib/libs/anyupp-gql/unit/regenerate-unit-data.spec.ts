import { combineLatest, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import {
  listGeneratedProductsForUnits,
  unitRequestHandler,
} from '@bgap/anyupp-gql/backend';
import { CrudApi } from '@bgap/crud-gql/api';
import { crudBackendGraphQLClient } from '@bgap/shared/graphql/api-client';
import { getSortedIds } from '@bgap/shared/utils';
import { generatedProductSeed, productSeed } from '@bgap/shared/fixtures';

import {
  createTestChainProduct,
  deleteTestChainProduct,
} from '../../../seeds/chain-product';
import {
  createTestGeneratedProduct,
  deleteTestGeneratedProduct,
} from '../../../seeds/generated-product';
import {
  createTestGroupProduct,
  deleteTestGroupProduct,
} from '../../../seeds/group-product';
import {
  createTestUnitProduct,
  deleteTestUnitProduct,
} from '../../../seeds/unit-product';

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
const unit01_generatedProduct_03_WONTBEREGENERATED = {
  ...generatedProductSeed.base,
  id: `generatedProduct_u${unitId_01}_03`,
  unitId: unitId_01,
};
const unit02_generatedProduct_01 = {
  ...generatedProductSeed.base,
  id: `generatedProduct_u${unitId_02}_01`,
  unitId: unitId_02,
};
// const unit02_generatedProduct_02 = {
//   ...generatedProductSeed.base,
//   id: `generatedProduct_u${unitId_02}_02`,
//   unitId: unitId_02,
// };

const chainProduct_01 = productSeed.chainProductBase;
const groupProduct_01: CrudApi.CreateGroupProductInput = {
  ...productSeed.groupProductBase,
  parentId: chainProduct_01.id!,
};
const unitProduct_0101: CrudApi.CreateUnitProductInput = {
  ...productSeed.unitProductBase,
  id: unit01_generatedProduct_01.id,
  parentId: groupProduct_01.id!,
};
const unitProduct_0102: CrudApi.CreateUnitProductInput = {
  ...productSeed.unitProductBase,
  id: unit01_generatedProduct_02.id,
  parentId: groupProduct_01.id!,
};
const unitProduct_0104_NEW: CrudApi.CreateUnitProductInput = {
  ...productSeed.unitProductBase,
  id: 'unit01_have_not_been_here_before',
  parentId: groupProduct_01.id!,
};
const unitProduct_0201_DIFFERENTUNIT: CrudApi.CreateUnitProductInput = {
  ...productSeed.unitProductBase,
  id: unit02_generatedProduct_01.id,
};
// const unitProduct_0202: CrudApi.CreateUnitProductInput = {
//   ...productSeed.unitProductBase,
//   id: unit02_generatedProduct_02.id,
// };

describe.skip('RegenerateUnitData mutation tests', () => {
  // let authHelper: AuthenticatdGraphQLClientWithUserId;

  beforeAll(async () => {
    // authHelper = await createAuthenticatedAnyuppGraphQLClient(
    //   testAdminUsername,
    //   testAdminUserPassword,
    // ).toPromise();
    // console.warn(authHelper.userAttributes);

    await combineLatest([
      // CleanUP
      deleteTestChainProduct(chainProduct_01.id!),
      deleteTestGroupProduct(groupProduct_01.id!),
      deleteTestUnitProduct(unitProduct_0101.id!),
      deleteTestUnitProduct(unitProduct_0102.id!),
      deleteTestUnitProduct(unitProduct_0201_DIFFERENTUNIT.id!),
      deleteTestUnitProduct(unitProduct_0104_NEW.id!),
      // // generated
      deleteTestGeneratedProduct(unit01_generatedProduct_01.id),
      deleteTestGeneratedProduct(unit01_generatedProduct_02.id),
      deleteTestGeneratedProduct(
        unit01_generatedProduct_03_WONTBEREGENERATED.id,
      ),
      deleteTestGeneratedProduct(unit02_generatedProduct_01.id),
    ])
      .pipe(
        switchMap(() =>
          // Seeding
          combineLatest([
            // CREATE CHAIN/GROUP/UNIT products
            createTestChainProduct(chainProduct_01),
            createTestGroupProduct(groupProduct_01),
            createTestUnitProduct(unitProduct_0101),
            createTestUnitProduct(unitProduct_0102),
            // we don't have const unitProduct_0103 because it won't be in the new generated list
            createTestUnitProduct(unitProduct_0104_NEW),
            createTestUnitProduct(unitProduct_0201_DIFFERENTUNIT),
            // simulate that we have previously generated products
            createTestGeneratedProduct(unit01_generatedProduct_01),
            createTestGeneratedProduct(unit01_generatedProduct_02),
            createTestGeneratedProduct(
              unit01_generatedProduct_03_WONTBEREGENERATED,
            ),
            createTestGeneratedProduct(unit02_generatedProduct_01),
          ]),
        ),
      )
      .toPromise();
  }, 25000);

  it('should regenerate all the generated products for the unit', done => {
    // const listGeneratedProductsForGivenUnits = () =>
    of('START')
      .pipe(
        // check start state
        switchMap(() =>
          listGeneratedProductsForUnits(crudBackendGraphQLClient, [
            unitId_01,
            unitId_02,
          ]),
        ),
        tap({
          next(result) {
            expect(result.length).toEqual(4);
            expect(getSortedIds(result)).toEqual([
              unitProduct_0101.id,
              unitProduct_0102.id,
              unit01_generatedProduct_03_WONTBEREGENERATED.id,
              unitProduct_0201_DIFFERENTUNIT.id,
            ]);
          },
        }),
        switchMap(() =>
          unitRequestHandler.regenerateUnitData(crudBackendGraphQLClient)({
            input: { id: unitId_01 },
          }),
        ),
        // Check
        switchMap(() =>
          listGeneratedProductsForUnits(crudBackendGraphQLClient, [
            unitId_01,
            unitId_02,
          ]),
        ),
        tap({
          next(result) {
            expect(result.length).toEqual(4);
            expect(getSortedIds(result)).toEqual([
              unitProduct_0101.id,
              unitProduct_0102.id,
              unitProduct_0104_NEW.id,
              unitProduct_0201_DIFFERENTUNIT.id,
            ]);
          },
        }),
      )
      // TOOD: execute func
      .subscribe({
        next() {
          done();
        },
        error(err) {
          console.error(
            '### ~ file: regenerate-unit-data.spec.ts ~ line 195 ~ error ~ err',
            err,
          );
        },
      });
    // TOOD: execute func
    // TODO: listGeneratedProductForAUnit -> snapshot
    // TOOD: modify unitProduct
    // TOOD: modify groupProduct
    // TOOD: modify chainProduct
    // TOOD: execute func
    // TODO: listGeneratedProductForAUnit -> snapshot
  }, 15000);
});
