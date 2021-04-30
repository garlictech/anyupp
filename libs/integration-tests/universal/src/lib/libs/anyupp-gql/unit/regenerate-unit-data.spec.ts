import { combineLatest, Observable, of, throwError } from 'rxjs';
import {
  delay,
  switchMap,
  tap,
  catchError,
  defaultIfEmpty,
  filter,
  map,
} from 'rxjs/operators';

import {
  listGeneratedProductsForUnits,
  unitRequestHandler,
} from '@bgap/anyupp-gql/backend';
import { CrudApi, CrudApiQueryDocuments } from '@bgap/crud-gql/api';
import {
  crudBackendGraphQLClient,
  executeQuery,
  GraphqlApiClient,
} from '@bgap/shared/graphql/api-client';
import {
  generatedProductSeed,
  productSeed,
  testIdPrefix,
  unitSeed,
} from '@bgap/shared/fixtures';

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
import { validateUnitProduct } from 'libs/shared/data-validators/src';
import { IUnitProduct } from '@bgap/shared/types';
import * as fp from 'lodash/fp';
import { getSortedIds } from '@bgap/shared/utils';

const DYNAMODB_OPERATION_DELAY = 3000;

const unitId_01 = unitSeed.unitId_seeded_01;
const unitId_02 = `${testIdPrefix}UNIT_ID_02_REGENERATE`;

const chainProduct_01 = productSeed.chainProductBase;
const groupProduct_01: CrudApi.CreateGroupProductInput = {
  ...productSeed.groupProductBase,
  parentId: chainProduct_01.id!,
};
const unitProduct_0101: CrudApi.CreateUnitProductInput = {
  ...productSeed.unitProductBase,
  id: `${testIdPrefix}unitProduct_u${unitId_01}_01`,
  parentId: groupProduct_01.id!,
  unitId: unitId_01,
};
const unitProduct_0102: CrudApi.CreateUnitProductInput = {
  ...productSeed.unitProductBase,
  id: `${testIdPrefix}unitProduct_u${unitId_01}_02`,
  parentId: groupProduct_01.id!,
  unitId: unitId_01,
};
const unitProduct_0104_NEW: CrudApi.CreateUnitProductInput = {
  ...productSeed.unitProductBase,
  id: `${testIdPrefix}unit01_have_not_been_here_before`,
  parentId: groupProduct_01.id!,
  unitId: unitId_01,
};
const unitProduct_0201_DIFFERENTUNIT: CrudApi.CreateUnitProductInput = {
  ...productSeed.unitProductBase,
  id: `${testIdPrefix}unitProduct_u${unitId_02}_01`,
  unitId: unitId_02,
};
// const unitProduct_0202: CrudApi.CreateUnitProductInput = {
//   ...productSeed.unitProductBase,
//   id: unit02_generatedProduct_02.id,
// };

const unit01_generatedProduct_01 = {
  ...generatedProductSeed.base,
  id: unitProduct_0101.id!,
  unitId: unitId_01,
};
const unit01_generatedProduct_02 = {
  ...generatedProductSeed.base,
  id: unitProduct_0102.id!,
  unitId: unitId_01,
};
// This generated prouduct won't have unit product with the same ID
// so the updated/regnerated ProductList shouldn't contain it.
const unit01_generatedProduct_03_WONTBEREGENERATED = {
  ...generatedProductSeed.base,
  id: `${testIdPrefix}generatedProduct_u${unitId_01}_03_WONTBEREGENERATED`,
  unitId: unitId_01,
};
const unit02_generatedProduct_01 = {
  ...generatedProductSeed.base,
  id: unitProduct_0201_DIFFERENTUNIT.id!,
  unitId: unitId_02,
};

describe('RegenerateUnitData mutation tests', () => {
  beforeAll(async () => {
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
      deleteTestGeneratedProduct(unitProduct_0104_NEW.id!),
    ])
      .pipe(
        delay(DYNAMODB_OPERATION_DELAY),
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
    combineLatest([
      listGeneratedProductsForUnits({
        crudGraphqlClient: crudBackendGraphQLClient,
        unitIds: [unitId_01, unitId_02],
        noCache: true,
      }),
      listProductsForUnits({
        unitIds: [unitId_01, unitId_02],
        crudGraphqlClient: crudBackendGraphQLClient,
      }),
    ])
      .pipe(
        tap({
          next(result) {
            const [generatedProducts, unitProducts] = result;
            expect(unitProducts.length).toEqual(6);
            expect(generatedProducts.length).toEqual(6);
            const upIds = getSortedIds(unitProducts);
            const genIds = getSortedIds(generatedProducts);

            // Same ids in the generatedProduct
            expect(genIds).toContainEqual(
              productSeed.unitProductId_seeded_id_01,
            );
            expect(upIds).toContainEqual(
              productSeed.unitProductId_seeded_id_01,
            );
            expect(genIds).toContainEqual(
              productSeed.unitProductId_seeded_id_02,
            );
            expect(upIds).toContainEqual(
              productSeed.unitProductId_seeded_id_02,
            );
            expect(genIds).toContainEqual(unitProduct_0201_DIFFERENTUNIT.id);
            expect(upIds).toContainEqual(unitProduct_0201_DIFFERENTUNIT.id);
            expect(genIds).toContainEqual(unitProduct_0101.id);
            expect(upIds).toContainEqual(unitProduct_0101.id);
            expect(genIds).toContainEqual(unitProduct_0102.id);
            expect(upIds).toContainEqual(unitProduct_0102.id);
            expect(genIds).toContainEqual(unitProduct_0102.id);
            expect(upIds).toContainEqual(unitProduct_0102.id);

            //extra
            expect(genIds).toContainEqual(
              unit01_generatedProduct_03_WONTBEREGENERATED.id,
            );
            expect(genIds).not.toContainEqual(unitProduct_0104_NEW.id);
            expect(upIds).toContainEqual(unitProduct_0104_NEW.id);
            expect(upIds).not.toContainEqual(
              unit01_generatedProduct_03_WONTBEREGENERATED.id,
            );
          },
        }),
        switchMap(() =>
          unitRequestHandler.regenerateUnitData(crudBackendGraphQLClient)({
            input: { id: unitId_01 },
          }),
        ),
        catchError(err => {
          console.error('START STATE CHECK ERROR');
          return throwError(err);
        }),
        // Check
        delay(DYNAMODB_OPERATION_DELAY),
        switchMap(() =>
          listGeneratedProductsForUnits({
            crudGraphqlClient: crudBackendGraphQLClient,
            unitIds: [unitId_01, unitId_02],
            noCache: true,
          }),
        ),
        tap({
          next(result) {
            expect(result.length).toEqual(6);
            const ids = result.map(x => x.id);

            expect(ids).toContainEqual(unitProduct_0201_DIFFERENTUNIT.id);
            expect(ids).toContainEqual(unitProduct_0104_NEW.id);
            expect(ids).toContainEqual(unitProduct_0101.id);
            expect(ids).toContainEqual(unitProduct_0102.id);

            expect(
              result.sort((a, b) => (a.id > b.id ? 1 : -1)),
            ).toMatchSnapshot();
          },
        }),
      )
      // execute func
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

    // TODO: extra test scenario could be
    // modify unitProduct
    // modify groupProduct
    // modify chainProduct
    // execute func
    // listGeneratedProductForAUnit -> snapshot
  }, 25000);
});

const listProductsForUnits = ({
  crudGraphqlClient,
  unitIds,
  noCache = false,
}: {
  crudGraphqlClient: GraphqlApiClient;
  unitIds: Array<string>;
  noCache?: boolean;
}): Observable<Array<IUnitProduct>> => {
  const input: CrudApi.ListGeneratedProductsQueryVariables = {
    filter: { or: unitIds.map(x => ({ unitId: { eq: x } })) },
  };
  return executeQuery(crudGraphqlClient)<CrudApi.ListUnitProductsQuery>(
    CrudApiQueryDocuments.listUnitProducts,
    input,
    { fetchPolicy: 'no-cache' },
  ).pipe(
    map(x => x.listUnitProducts?.items),
    filter(fp.negate(fp.isEmpty)),
    defaultIfEmpty([]),
    switchMap(items => combineLatest(items.map(validateUnitProduct))),
    catchError(err => {
      console.error(err);
      return throwError('Internal listUnitProducts query error');
    }),
  );
};
