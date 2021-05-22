import { combineLatest, concat, Observable, of, throwError } from 'rxjs';
import {
  delay,
  switchMap,
  tap,
  catchError,
  defaultIfEmpty,
  map,
  toArray,
  take,
} from 'rxjs/operators';

import {
  listGeneratedProductsForUnits,
  unitRequestHandler,
} from '@bgap/anyupp-gql/backend';
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
import { validateUnitProduct } from '@bgap/shared/data-validators';
import { filterNullish, getSortedIds } from '@bgap/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { createIamCrudSdk } from 'libs/integration-tests/universal/src/api-clients';

const DYNAMODB_OPERATION_DELAY = 3000;

const unitId_01 = unitSeed.unitId_seeded_01;
const unitId_02 = `${testIdPrefix}UNIT_ID_02_REGENERATE`;

const chainProduct_01 = productSeed.chainProductBase;
const groupProduct_01: CrudApi.CreateGroupProductInput & { id: string } = {
  ...productSeed.groupProductBase,
  parentId: chainProduct_01.id!,
};
const unitProduct_0101: CrudApi.CreateUnitProductInput & { id: string } = {
  ...productSeed.unitProductBase,
  id: `${testIdPrefix}unitProduct_u${unitId_01}_01`,
  parentId: groupProduct_01.id!,
  unitId: unitId_01,
};
const unitProduct_0102: CrudApi.CreateUnitProductInput & { id: string } = {
  ...productSeed.unitProductBase,
  id: `${testIdPrefix}unitProduct_u${unitId_01}_02`,
  parentId: groupProduct_01.id!,
  unitId: unitId_01,
};
const unitProduct_0104_NEW: CrudApi.CreateUnitProductInput & { id: string } = {
  ...productSeed.unitProductBase,
  id: `${testIdPrefix}unit01_have_not_been_here_before`,
  parentId: groupProduct_01.id!,
  unitId: unitId_01,
};
const unitProduct_0201_DIFFERENTUNIT: CrudApi.CreateUnitProductInput & {
  id: string;
} = {
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
  const iamCrudSdk = createIamCrudSdk();

  const cleanup = concat(
    // CleanUP
    deleteTestChainProduct(chainProduct_01.id, iamCrudSdk).pipe(take(1)),
    deleteTestGroupProduct(groupProduct_01.id, iamCrudSdk),
    deleteTestUnitProduct(unitProduct_0101.id, iamCrudSdk),
    deleteTestUnitProduct(unitProduct_0102.id, iamCrudSdk),
    deleteTestUnitProduct(unitProduct_0201_DIFFERENTUNIT.id, iamCrudSdk),
    deleteTestUnitProduct(unitProduct_0104_NEW.id, iamCrudSdk),
    // // generated
    deleteTestGeneratedProduct(unit01_generatedProduct_01.id, iamCrudSdk),
    deleteTestGeneratedProduct(unit01_generatedProduct_02.id, iamCrudSdk),
    deleteTestGeneratedProduct(
      unit01_generatedProduct_03_WONTBEREGENERATED.id,
      iamCrudSdk,
    ),
    deleteTestGeneratedProduct(unit02_generatedProduct_01.id, iamCrudSdk),
    deleteTestGeneratedProduct(unitProduct_0104_NEW.id, iamCrudSdk),
  ).pipe(toArray());

  beforeAll(async () => {
    await cleanup
      .pipe(
        tap(x => console.warn('********1', x)),
        switchMap(() =>
          // Seeding
          concat(
            // CREATE CHAIN/GROUP/UNIT products
            createTestChainProduct(chainProduct_01, iamCrudSdk),
            createTestGroupProduct(groupProduct_01, iamCrudSdk),
            createTestUnitProduct(unitProduct_0101, iamCrudSdk),
            createTestUnitProduct(unitProduct_0102, iamCrudSdk),
            // we don't have const unitProduct_0103 because it won't be in the new generated list
            createTestUnitProduct(unitProduct_0104_NEW, iamCrudSdk),
            createTestUnitProduct(unitProduct_0201_DIFFERENTUNIT, iamCrudSdk),
            // simulate that we have previously generated products
            createTestGeneratedProduct(unit01_generatedProduct_01, iamCrudSdk),
            createTestGeneratedProduct(unit01_generatedProduct_02, iamCrudSdk),
            createTestGeneratedProduct(
              unit01_generatedProduct_03_WONTBEREGENERATED,
              iamCrudSdk,
            ),
            createTestGeneratedProduct(unit02_generatedProduct_01, iamCrudSdk),
          ),
        ),
        tap(x => console.warn('********2', x)),
      )
      .toPromise();
  }, 25000);

  afterAll(async () => {
    await cleanup.toPromise();
  });

  it.skip('should regenerate all the generated products for the unit', done => {
    // const listGeneratedProductsForGivenUnits = () =>
    combineLatest([
      listGeneratedProductsForUnits([unitId_01, unitId_02])({
        crudSdk: iamCrudSdk,
      }),
      listProductsForUnits(iamCrudSdk, [unitId_01, unitId_02]),
    ])
      .pipe(
        tap({
          next(result) {
            const [generatedProducts, unitProducts] = result;
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
          unitRequestHandler({ crudSdk: iamCrudSdk }).regenerateUnitData({
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
          listGeneratedProductsForUnits([unitId_01, unitId_02])({
            crudSdk: iamCrudSdk,
          }),
        ),
        tap({
          next(result) {
            const expectedGeneratedIds = [
              productSeed.unitProductId_seeded_id_01,
              productSeed.unitProductId_seeded_id_02,
              unitProduct_0201_DIFFERENTUNIT.id,
              unitProduct_0104_NEW.id,
              unitProduct_0101.id,
              unitProduct_0102.id,
            ];
            const ids = result.map(x => x.id);

            expectedGeneratedIds.forEach(id => {
              expect(ids).toContainEqual(id);
            });

            expect(
              result
                .filter(x => expectedGeneratedIds.includes(x.id))
                .sort((a, b) => (a.id > b.id ? 1 : -1)),
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

const listProductsForUnits = (
  sdk: CrudApi.CrudSdk,
  unitIds: string[],
): Observable<Array<CrudApi.UnitProduct>> => {
  const input: CrudApi.ListGeneratedProductsQueryVariables = {
    filter: { or: unitIds.map(x => ({ unitId: { eq: x } })) },
  };
  return sdk
    .ListUnitProducts(input)
    .pipe(
      filterNullish(),
      map(x => x.items),
      filterNullish(),
      switchMap(items => combineLatest(items.map(x => validateUnitProduct(x)))),
      catchError(err => {
        console.warn('THIS MAY BE IMPORTANT, FROM WRONG PRODUCT HANDLING???');
        console.warn(err);
        return of([]);
      }),
    )
    .pipe(defaultIfEmpty([] as CrudApi.UnitProduct[]));
};
