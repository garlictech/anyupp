import { CrudSdk } from '@bgap/crud-gql/api';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  chainFixture,
  generatedProductFixture,
  groupFixture,
  productCategoryFixture,
  productComponentSetFixture,
  productFixture,
  testAdminUsername,
  testAdminUserPassword,
  testIdPrefix,
  unitFixture,
} from '@bgap/shared/fixtures';
import { RequiredId } from '@bgap/shared/types';
import {
  filterNullishGraphqlListWithDefault,
  getSortedIds,
  sortById,
} from '@bgap/shared/utils';
import { delay, map, switchMap, take, tap, toArray } from 'rxjs/operators';
import { combineLatest, concat, Observable, of } from 'rxjs';
import {
  createAuthenticatedCrudSdk,
  createIamCrudSdk,
} from '../../../../api-clients';
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
  createTestProductComponent,
  createTestProductComponentSet,
  deleteTestProductComponent,
  deleteTestProductComponentSet,
} from '../../../seeds/product-component-set';
import { createTestUnit, deleteTestUnit } from '../../../seeds/unit';
import {
  createTestUnitProduct,
  deleteTestUnitProduct,
} from '../../../seeds/unit-product';
import { getSortedProductCatIds } from '../test-utils/test-utils';
import {
  deleteGeneratedProductCategoriesForAUnit,
  listGeneratedProductCategoriesForUnits,
} from '@bgap/backend/product-categories';
import { unitRequestHandler } from '@bgap/backend/units';
import { listGeneratedProductsForUnits } from '@bgap/backend/products';
import { dateMatcher, ES_DELAY } from '../../../../utils';

const DYNAMODB_OPERATION_DELAY = 60000;
const TEST_NAME = 'REGEN_';

const chainId_01_seeded = productComponentSetFixture.seededProdComp_11.chainId;
const unitId_01_to_regen = `${testIdPrefix}${TEST_NAME}UNIT_ID_01`;
const unitId_02 = `${testIdPrefix}${TEST_NAME}UNIT_ID_02`;

// UNIT
const unit_01: RequiredId<CrudApi.CreateUnitInput> = {
  ...unitFixture.unitBase,
  id: unitId_01_to_regen,
  groupId: groupFixture.groupId_seeded_01,
  chainId: chainFixture.chainId_seeded_01,
};

// CONFIG SETS/COMPONENTS to create
const prodComponent_01: RequiredId<CrudApi.CreateProductComponentInput> = {
  ...productComponentSetFixture.seededProdComp_11,
  id: `${testIdPrefix}${TEST_NAME}prodComp_01`,
};
const prodComponent_02: RequiredId<CrudApi.CreateProductComponentInput> = {
  ...productComponentSetFixture.seededProdComp_21,
  id: `${testIdPrefix}${TEST_NAME}prodComp_02`,
};
const prodComponent_03: RequiredId<CrudApi.CreateProductComponentInput> = {
  ...productComponentSetFixture.seededProdComp_31,
  id: `${testIdPrefix}${TEST_NAME}prodComp_03`,
};

const prodCompSet_01: RequiredId<CrudApi.CreateProductComponentSetInput> = {
  ...productComponentSetFixture.getComponentSet({
    id: `${testIdPrefix}${TEST_NAME}prodCompSet_01`,
    chainId: chainId_01_seeded,
    itemIds: [prodComponent_01.id, prodComponent_02.id],
  }),
  type: CrudApi.ProductComponentSetType.extras,
};
const prodCompSet_02: RequiredId<CrudApi.CreateProductComponentSetInput> = {
  ...productComponentSetFixture.getComponentSet({
    id: `${testIdPrefix}${TEST_NAME}prodCompSet_02`,
    chainId: chainId_01_seeded,
    itemIds: [prodComponent_01.id, prodComponent_02.id, prodComponent_03.id],
  }),
  type: CrudApi.ProductComponentSetType.modifier,
};

const prodConfigSet_01: CrudApi.ProductConfigSetInput = {
  position: 1,
  productSetId: prodCompSet_01.id,
  items: [
    {
      position: 1,
      productComponentId: prodCompSet_01.items[0],
      refGroupPrice: 0,
      price: 0,
      netPackagingFee: 1000,
    },
    {
      position: 2,
      productComponentId: prodCompSet_01.items[1],
      refGroupPrice: 0,
      price: 0,
    },
  ],
};
const prodConfigSet_02: CrudApi.ProductConfigSetInput = {
  position: 2,
  productSetId: prodCompSet_02.id,
  items: [
    {
      position: 1,
      productComponentId: prodCompSet_02.items[0],
      refGroupPrice: 0,
      price: 0,
    },
    {
      position: 2,
      productComponentId: prodCompSet_02.items[1],
      refGroupPrice: 0,
      price: 0,
    },
    {
      position: 3,
      productComponentId: prodCompSet_02.items[2],
      refGroupPrice: 0,
      price: 0,
    },
  ],
};
// PRODUCT CATEGORY to create
const productCategory_01: RequiredId<CrudApi.CreateProductCategoryInput> = {
  ...productCategoryFixture.productCategoryBase,
  id: `${testIdPrefix}${TEST_NAME}_ProductCategoryId_01`,
  chainId: unit_01.chainId,
};
// PRODUCTS to create
const chainProduct_01: RequiredId<CrudApi.CreateChainProductInput> = {
  ...productFixture.chainProductInputBase,
  id: `${testIdPrefix}${TEST_NAME}chainProduct_01`,
  productCategoryId: productCategory_01.id,
};
const groupProduct_01: RequiredId<CrudApi.CreateGroupProductInput> = {
  ...productFixture.groupProductInputBase,
  id: `${testIdPrefix}${TEST_NAME}groupProduct_01`,
  parentId: chainProduct_01.id,
};
// THE IMPORTANT UNIT
const unitProduct_0101: Omit<
  CrudApi.CreateUnitProductInput,
  'id' | 'configSets'
> & { id: string; configSets: CrudApi.ProductConfigSetInput[] } = {
  ...productFixture.unitProductInputBase,
  // id = test_REGEN_unitProduct_useeded_unit_c1_g1_1_id_01
  id: `${testIdPrefix}${TEST_NAME}unitProduct_u${unitId_01_to_regen}_01`,
  parentId: groupProduct_01.id,
  unitId: unitId_01_to_regen,
  chainId: chainId_01_seeded,
  configSets: [prodConfigSet_01, prodConfigSet_02],
};
const unitProduct_0102: RequiredId<CrudApi.CreateUnitProductInput> = {
  ...productFixture.unitProductInputBase,
  id: `${testIdPrefix}${TEST_NAME}unitProduct_u${unitId_01_to_regen}_02`,
  parentId: groupProduct_01.id,
  chainId: chainId_01_seeded,
  unitId: unitId_01_to_regen,
};
const unitProduct_0104_NEW: RequiredId<CrudApi.CreateUnitProductInput> = {
  ...productFixture.unitProductInputBase,
  id: `${testIdPrefix}${TEST_NAME}unit01_have_not_been_here_before`,
  parentId: groupProduct_01.id,
  chainId: chainId_01_seeded,
  unitId: unitId_01_to_regen,
};
const unitProduct_0201_DIFFERENTUNIT: RequiredId<CrudApi.CreateUnitProductInput> =
  {
    ...productFixture.unitProductInputBase,
    id: `${testIdPrefix}${TEST_NAME}unitProduct_u${unitId_02}_01`,
    parentId: groupProduct_01.id, // it is from a different unit, but it is not
    chainId: chainId_01_seeded,
    unitId: unitId_02,
  };

// GENERATED PRODUCTS to create
const generatedProduct_fromUnitProduct_0101 = {
  ...generatedProductFixture.base,
  id: unitProduct_0101.id,
  unitId: unitId_01_to_regen,
};
const generatedProduct_fromUnitProduct_0102 = {
  ...generatedProductFixture.base,
  id: unitProduct_0102.id,
  unitId: unitId_01_to_regen,
};
// This generated prouduct won't have unit product with the same ID
// so the updated/regnerated ProductList shouldn't contain it.
const unit01_generatedProduct_03_WONTBEREGENERATED = {
  ...generatedProductFixture.base,
  id: `${testIdPrefix}${TEST_NAME}generatedProduct_u${unitId_01_to_regen}_03_WONTBEREGENERATED`,
  unitId: unitId_01_to_regen,
};
const unit02_generatedProduct_01 = {
  ...generatedProductFixture.base,
  id: unitProduct_0201_DIFFERENTUNIT.id,
  unitId: unitId_02,
};

describe.skip('RegenerateUnitData mutation tests', () => {
  const iamCrudSdk = createIamCrudSdk();
  let authCrudSdk: CrudSdk;

  const cleanup = () =>
    concat(
      // CleanUP
      deleteGeneratedProductCategoriesForAUnit({ crudSdk: iamCrudSdk })(
        unitId_01_to_regen,
      ),
      iamCrudSdk.DeleteProductCategory({
        input: { id: productCategory_01.id },
      }),
      deleteTestProductComponent(prodComponent_01.id, iamCrudSdk),
      deleteTestProductComponent(prodComponent_02.id, iamCrudSdk),
      deleteTestProductComponent(prodComponent_03.id, iamCrudSdk),
      deleteTestProductComponentSet(prodCompSet_01.id, iamCrudSdk),
      deleteTestProductComponentSet(prodCompSet_02.id, iamCrudSdk),
      deleteTestUnitProduct(unitProduct_0101.id, iamCrudSdk),
      deleteTestUnitProduct(unitProduct_0102.id, iamCrudSdk),
      deleteTestUnitProduct(unitProduct_0201_DIFFERENTUNIT.id, iamCrudSdk),
      deleteTestUnitProduct(unitProduct_0104_NEW.id, iamCrudSdk),
      deleteTestGroupProduct(groupProduct_01.id, iamCrudSdk),
      deleteTestChainProduct(chainProduct_01.id, iamCrudSdk).pipe(take(1)),
      // // generated
      deleteTestGeneratedProduct(
        generatedProduct_fromUnitProduct_0101.id,
        iamCrudSdk,
      ),
      deleteTestGeneratedProduct(
        generatedProduct_fromUnitProduct_0102.id,
        iamCrudSdk,
      ),
      deleteTestGeneratedProduct(
        unit01_generatedProduct_03_WONTBEREGENERATED.id,
        iamCrudSdk,
      ),
      deleteTestGeneratedProduct(unit02_generatedProduct_01.id, iamCrudSdk),
      deleteTestGeneratedProduct(unitProduct_0104_NEW.id, iamCrudSdk),
      deleteTestUnit(unitId_01_to_regen, iamCrudSdk),
    ).pipe(toArray());

  beforeAll(done => {
    createAuthenticatedCrudSdk(testAdminUsername, testAdminUserPassword)
      .pipe(tap(auth => (authCrudSdk = auth)))
      .subscribe(() => done());
  }, 25000);

  beforeEach(done => {
    cleanup()
      .pipe(
        delay(DYNAMODB_OPERATION_DELAY),
        switchMap(() =>
          concat(
            createTestUnit(unit_01, iamCrudSdk),
            createTestProductComponent(prodComponent_01, iamCrudSdk),
            createTestProductComponent(prodComponent_02, iamCrudSdk),
            createTestProductComponent(prodComponent_03, iamCrudSdk),
            createTestProductComponentSet(prodCompSet_01, iamCrudSdk),
            createTestProductComponentSet(prodCompSet_02, iamCrudSdk),
            // CREATE CHAIN/GROUP/UNIT products
            createTestChainProduct(chainProduct_01, iamCrudSdk),
            createTestGroupProduct(groupProduct_01, iamCrudSdk),
            createTestUnitProduct(unitProduct_0101, iamCrudSdk),
            createTestUnitProduct(unitProduct_0102, iamCrudSdk),
            // we don't have const unitProduct_0103 because it won't be in the new generated list
            createTestUnitProduct(unitProduct_0104_NEW, iamCrudSdk),
            createTestUnitProduct(unitProduct_0201_DIFFERENTUNIT, iamCrudSdk),
            // simulate that we have previously generated products
            createTestGeneratedProduct(
              generatedProduct_fromUnitProduct_0101,
              iamCrudSdk,
            ),
            createTestGeneratedProduct(
              generatedProduct_fromUnitProduct_0102,
              iamCrudSdk,
            ),
            createTestGeneratedProduct(
              unit01_generatedProduct_03_WONTBEREGENERATED,
              iamCrudSdk,
            ),
            createTestGeneratedProduct(unit02_generatedProduct_01, iamCrudSdk),
            iamCrudSdk.CreateProductCategory({ input: productCategory_01 }),
          ),
        ),
        delay(ES_DELAY),
        toArray(),
      )
      .subscribe(() => done());
  }, 25000);

  afterAll(done => {
    cleanup().subscribe(() => done());
  }, 15000);

  it('should return helpful error message in case the unit has no items', done => {
    const input = { id: 'EMPTY UNIT' };

    of('start')
      .pipe(
        switchMap(() =>
          unitRequestHandler(iamCrudSdk).regenerateUnitData({
            input,
          }),
        ),
      )
      .subscribe({
        error(err) {
          expect(err).toMatchSnapshot();
          done();
        },
      });
  });

  const testLogic = (
    op: (
      input: CrudApi.MutationRegenerateUnitDataArgs,
    ) => ReturnType<CrudApi.CrudSdk['RegenerateUnitData']>,
  ) => {
    const input = { id: unitId_01_to_regen };

    const calc1 = combineLatest([
      listGeneratedProductsForUnits(iamCrudSdk)([
        unitId_01_to_regen,
        unitId_02,
      ]),
      listProductsForUnits(iamCrudSdk, [unitId_01_to_regen, unitId_02]),
    ]).pipe(
      // PHASE 0: PREPARE - start state check
      tap({
        next(result) {
          const [generatedProducts, unitProducts] = result;
          const upIds = getSortedIds(unitProducts);
          const genIds = getSortedIds(generatedProducts);
          expect(genIds).toContainEqual(unitProduct_0201_DIFFERENTUNIT.id);
          expect(upIds).toContainEqual(unitProduct_0201_DIFFERENTUNIT.id);
          expect(genIds).toContainEqual(unitProduct_0101.id);
          expect(upIds).toContainEqual(unitProduct_0101.id);
          expect(genIds).toContainEqual(unitProduct_0102.id);
          expect(upIds).toContainEqual(unitProduct_0102.id);
          expect(genIds).toContainEqual(unitProduct_0102.id);
          expect(upIds).toContainEqual(unitProduct_0102.id);

          const aGeneratedProduct = generatedProducts.find(
            x => x.id === unitProduct_0101.id,
          );

          expect(aGeneratedProduct).toHaveProperty('configSets', null);
          expect(aGeneratedProduct?.variants).toMatchSnapshot('VARIANTS');
          expect(aGeneratedProduct?.configSets).toMatchSnapshot('CONFIG SETS');

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

      // PHASE 1: EXECUTE THE LOGIC - check generated products
      switchMap(() => op({ input })),
      // ASSERTIONS
      delay(DYNAMODB_OPERATION_DELAY),
      switchMap(() =>
        listGeneratedProductsForUnits(iamCrudSdk)([
          unitId_01_to_regen,
          unitId_02,
        ]),
      ),
      tap({
        next(result) {
          const expectedGeneratedIds = [
            unitProduct_0201_DIFFERENTUNIT.id,
            unitProduct_0104_NEW.id,
            unitProduct_0101.id,
            unitProduct_0102.id,
          ].sort();

          const ids = result.map(x => x.id).sort();
          expect(expectedGeneratedIds).toEqual(ids);

          expect(
            result
              .filter(x => expectedGeneratedIds.includes(x.id))
              .sort((a, b) => (a.id > b.id ? 1 : -1))
              .map(
                ({ updatedAt, createdAt, ...fieldToSnapshot }) =>
                  fieldToSnapshot,
              ),
          ).toMatchSnapshot();
        },
      }),
    );

    return calc1.pipe(
      // PHASE 2: Check a single generated Item with the config sets
      tap({
        next(result) {
          // Generated CONFIG SET check
          const productToCheck = unitProduct_0101;
          console.log(`Check the ${productToCheck.id}'s field`);

          const aGeneratedProduct = result.find(
            x => x.id === productToCheck.id,
          );
          expect(aGeneratedProduct).toMatchSnapshot(dateMatcher);
        },
      }),

      // PHASE 3: Check the generated PRODUCT CATEGORIES
      switchMap(() =>
        listGeneratedProductCategoriesForUnits({ crudSdk: iamCrudSdk })([
          unitId_01_to_regen,
        ]),
      ),
      map(sortById),
      tap({
        next(result) {
          // ONLY THE PRECREATED GENCATEGORY SHOULD EXIST
          expect(getSortedProductCatIds(result)).toEqual([
            productCategory_01.id,
          ]);
          expect(result[0].productCategoryId).toEqual(productCategory_01.id);
          expect(result[0].productNum).toEqual(3);
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
    );
  };

  it('should regenerate all the generated products for the unit with direct resolver', done => {
    testLogic(unitRequestHandler(iamCrudSdk).regenerateUnitData).subscribe(() =>
      done(),
    );
  }, 25000);

  it('should regenerate all the generated products for the unit with API', done => {
    testLogic(authCrudSdk.RegenerateUnitData).subscribe(() => done());
  }, 25000);
});

const listProductsForUnits = (
  sdk: CrudApi.CrudSdk,
  unitIds: string[],
): Observable<Array<CrudApi.UnitProduct>> => {
  const input: CrudApi.SearchUnitProductsQueryVariables = {
    filter: { or: unitIds.map(x => ({ unitId: { eq: x } })) },
  };
  return sdk
    .SearchUnitProducts(input, { fetchPolicy: 'no-cache' })
    .pipe(filterNullishGraphqlListWithDefault<CrudApi.UnitProduct>([]));
};
