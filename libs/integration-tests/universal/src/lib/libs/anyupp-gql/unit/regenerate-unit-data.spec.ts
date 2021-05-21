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
  productComponentSetSeed,
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
import {
  EProductComponentSetType,
  IUnitProduct,
  RequiredId,
} from '@bgap/shared/types';
import * as fp from 'lodash/fp';
import { getSortedIds } from '@bgap/shared/utils';
import {
  createTestProductComponent,
  createTestProductComponentSet,
  deleteTestProductComponent,
  deleteTestProductComponentSet,
} from '../../../seeds/product-component-set';

const DYNAMODB_OPERATION_DELAY = 3000;
const TEST_NAME = 'REGEN_';

const chainId_01_seeded = productComponentSetSeed.seededProdComp_01.chainId;
const unitId_01_seeded = unitSeed.unitId_seeded_01;
const unitId_02 = `${testIdPrefix}${TEST_NAME}UNIT_ID_02`;

// CONFIG SETS/COMPONENTS to create
const prodComponent_01: RequiredId<CrudApi.CreateProductComponentInput> = {
  ...productComponentSetSeed.seededProdComp_01,
  id: `${testIdPrefix}${TEST_NAME}prodComp_01`,
};
const prodComponent_02: RequiredId<CrudApi.CreateProductComponentInput> = {
  ...productComponentSetSeed.seededProdComp_02,
  id: `${testIdPrefix}${TEST_NAME}prodComp_02`,
};
const prodComponent_03: RequiredId<CrudApi.CreateProductComponentInput> = {
  ...productComponentSetSeed.seededProdComp_03,
  id: `${testIdPrefix}${TEST_NAME}prodComp_03`,
};

const prodCompSet_01: RequiredId<CrudApi.CreateProductComponentSetInput> = {
  ...productComponentSetSeed.getComponentSet({
    id: `${testIdPrefix}${TEST_NAME}prodCompSet_01`,
    chainId: chainId_01_seeded,
    itemIds: [prodComponent_01.id, prodComponent_02.id],
  }),
  type: EProductComponentSetType.EXTRAS,
};
const prodCompSet_02: RequiredId<CrudApi.CreateProductComponentSetInput> = {
  ...productComponentSetSeed.getComponentSet({
    id: `${testIdPrefix}${TEST_NAME}prodCompSet_02`,
    chainId: chainId_01_seeded,
    itemIds: [prodComponent_01.id, prodComponent_02.id, prodComponent_03.id],
  }),
  type: EProductComponentSetType.MODIFIER,
};

// HELPER MAPS
const prodComponentSetMap = {
  [prodCompSet_01.id]: prodCompSet_01,
  [prodCompSet_02.id]: prodCompSet_02,
};
const prodComponentMap = {
  [prodComponent_01.id]: prodComponent_01,
  [prodComponent_02.id]: prodComponent_02,
  [prodComponent_03.id]: prodComponent_03,
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
// PRODUCTS to create
const chainProduct_01: RequiredId<CrudApi.CreateChainProductInput> = {
  ...productSeed.chainProductBase,
  id: `${testIdPrefix}${TEST_NAME}chainProduct_01`,
};
const groupProduct_01: RequiredId<CrudApi.CreateGroupProductInput> = {
  ...productSeed.groupProductBase,
  id: `${testIdPrefix}${TEST_NAME}groupProduct_01`,
  parentId: chainProduct_01.id,
};
// THE IMPORTANT UNIT
const unitProduct_0101: Omit<
  CrudApi.CreateUnitProductInput,
  'id' | 'configSets'
> & { id: string; configSets: CrudApi.ProductConfigSetInput[] } = {
  ...productSeed.unitProductBase,
  // id = test_REGEN_unitProduct_useeded_unit_c1_g1_1_id_01
  id: `${testIdPrefix}${TEST_NAME}unitProduct_u${unitId_01_seeded}_01`,
  parentId: groupProduct_01.id,
  unitId: unitId_01_seeded,
  chainId: chainId_01_seeded,
  configSets: [prodConfigSet_01, prodConfigSet_02],
};
const unitProduct_0102: RequiredId<CrudApi.CreateUnitProductInput> = {
  ...productSeed.unitProductBase,
  id: `${testIdPrefix}${TEST_NAME}unitProduct_u${unitId_01_seeded}_02`,
  parentId: groupProduct_01.id,
  chainId: chainId_01_seeded,
  unitId: unitId_01_seeded,
};
const unitProduct_0104_NEW: RequiredId<CrudApi.CreateUnitProductInput> = {
  ...productSeed.unitProductBase,
  id: `${testIdPrefix}${TEST_NAME}unit01_have_not_been_here_before`,
  parentId: groupProduct_01.id,
  chainId: chainId_01_seeded,
  unitId: unitId_01_seeded,
};
const unitProduct_0201_DIFFERENTUNIT: RequiredId<CrudApi.CreateUnitProductInput> = {
  ...productSeed.unitProductBase,
  id: `${testIdPrefix}${TEST_NAME}unitProduct_u${unitId_02}_01`,
  chainId: chainId_01_seeded,
  unitId: unitId_02,
};

// GENERATED PRODUCTS to create
const generatedProduct_fromUnitProduct_0101 = {
  ...generatedProductSeed.base,
  id: unitProduct_0101.id,
  unitId: unitId_01_seeded,
};
const generatedProduct_fromUnitProduct_0102 = {
  ...generatedProductSeed.base,
  id: unitProduct_0102.id,
  unitId: unitId_01_seeded,
};
// This generated prouduct won't have unit product with the same ID
// so the updated/regnerated ProductList shouldn't contain it.
const unit01_generatedProduct_03_WONTBEREGENERATED = {
  ...generatedProductSeed.base,
  id: `${testIdPrefix}${TEST_NAME}generatedProduct_u${unitId_01_seeded}_03_WONTBEREGENERATED`,
  unitId: unitId_01_seeded,
};
const unit02_generatedProduct_01 = {
  ...generatedProductSeed.base,
  id: unitProduct_0201_DIFFERENTUNIT.id,
  unitId: unitId_02,
};

describe('RegenerateUnitData mutation tests', () => {
  const cleanUP = () =>
    combineLatest([
      // CleanUP
      deleteTestProductComponent(prodComponent_01.id),
      deleteTestProductComponent(prodComponent_02.id),
      deleteTestProductComponent(prodComponent_03.id),
      deleteTestProductComponentSet(prodCompSet_01.id),
      deleteTestProductComponentSet(prodCompSet_02.id),
      deleteTestChainProduct(chainProduct_01.id),
      deleteTestGroupProduct(groupProduct_01.id),
      deleteTestUnitProduct(unitProduct_0101.id),
      deleteTestUnitProduct(unitProduct_0102.id),
      deleteTestUnitProduct(unitProduct_0201_DIFFERENTUNIT.id),
      deleteTestUnitProduct(unitProduct_0104_NEW.id),
      // generated
      deleteTestGeneratedProduct(generatedProduct_fromUnitProduct_0101.id),
      deleteTestGeneratedProduct(generatedProduct_fromUnitProduct_0102.id),
      deleteTestGeneratedProduct(
        unit01_generatedProduct_03_WONTBEREGENERATED.id,
      ),
      deleteTestGeneratedProduct(unit02_generatedProduct_01.id),
      deleteTestGeneratedProduct(unitProduct_0104_NEW.id),
    ]);

  beforeAll(async () => {
    await cleanUP()
      .pipe(
        delay(DYNAMODB_OPERATION_DELAY),
        switchMap(() =>
          // Seeding
          combineLatest([
            createTestProductComponent(prodComponent_01),
            createTestProductComponent(prodComponent_02),
            createTestProductComponent(prodComponent_03),
            createTestProductComponentSet(prodCompSet_01),
            createTestProductComponentSet(prodCompSet_02),
            // CREATE CHAIN/GROUP/UNIT products
            createTestChainProduct(chainProduct_01),
            createTestGroupProduct(groupProduct_01),
            createTestUnitProduct(unitProduct_0101),
            createTestUnitProduct(unitProduct_0102),
            // we don't have unitProduct_0103 because it won't be in the new generated list
            createTestUnitProduct(unitProduct_0104_NEW),
            createTestUnitProduct(unitProduct_0201_DIFFERENTUNIT),
            // simulate that we have previously generated products
            createTestGeneratedProduct(generatedProduct_fromUnitProduct_0101),
            createTestGeneratedProduct(generatedProduct_fromUnitProduct_0102),
            createTestGeneratedProduct(
              unit01_generatedProduct_03_WONTBEREGENERATED,
            ),
            createTestGeneratedProduct(unit02_generatedProduct_01),
          ]),
        ),
      )
      .toPromise();
  }, 25000);

  afterAll(() => cleanUP().toPromise(), 25000);

  it('should regenerate all the generated products for the unit', done => {
    // const listGeneratedProductsForGivenUnits = () =>
    combineLatest([
      listGeneratedProductsForUnits({
        crudGraphqlClient: crudBackendGraphQLClient,
        unitIds: [unitId_01_seeded, unitId_02],
        noCache: true,
      }),
      listProductsForUnits({
        unitIds: [unitId_01_seeded, unitId_02],
        crudGraphqlClient: crudBackendGraphQLClient,
      }),
    ])
      .pipe(
        // PREPARE - start state check
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
        catchError(err => {
          console.error('START STATE CHECK ERROR');
          return throwError(err);
        }),

        // EXECUTE THE LOGIC
        switchMap(() =>
          unitRequestHandler.regenerateUnitData(crudBackendGraphQLClient)({
            input: { id: unitId_01_seeded },
          }),
        ),

        // ASSERTIONS
        delay(DYNAMODB_OPERATION_DELAY),
        switchMap(() =>
          listGeneratedProductsForUnits({
            crudGraphqlClient: crudBackendGraphQLClient,
            unitIds: [unitId_01_seeded, unitId_02],
            noCache: true,
          }),
        ),
        tap({
          next(result) {
            const expectedGeneratedIds = [
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
                .sort((a, b) => (a.id > b.id ? 1 : -1))
                .map(
                  ({ updatedAt, createdAt, ...fieldToSnapshot }) =>
                    fieldToSnapshot,
                ),
            ).toMatchSnapshot();
          },
        }),
        // Check a single generated Item with the config sets
        tap({
          next(result) {
            // Generated CONFIG SET check
            const productToCheck = unitProduct_0101;
            console.log(`Check the ${productToCheck.id}'s field`);

            const aGeneratedProduct = result.find(
              x => x.id === productToCheck.id,
            );
            expect(aGeneratedProduct).toHaveProperty('allergens');
            expect(aGeneratedProduct?.configSets).not.toBeNull();
            if (!aGeneratedProduct || !aGeneratedProduct.configSets) {
              throw `configSets is missing from the ${productToCheck.id} product`;
            }
            expect(aGeneratedProduct.configSets).toHaveLength(2);
            // The productSetId is not needed in the generated product
            expect(aGeneratedProduct.configSets[0]).not.toHaveProperty(
              'productSetId',
              prodConfigSet_01.productSetId,
            );
            expect(aGeneratedProduct.configSets[0].items).toHaveLength(2);

            const expectedCompSet_01 =
              prodComponentSetMap[productToCheck.configSets[0].productSetId];
            const expectedComp_0_0 =
              prodComponentMap[
                productToCheck.configSets[0].items[0].productComponentId
              ];
            const expectedComp_0_1 =
              prodComponentMap[
                productToCheck.configSets[0].items[1].productComponentId
              ];
            // TODO: use when the __typename fields have been removed from the query responses const expectedGeneratedProductConfigComponentSet_01: CrudApi.GeneratedProductConfigSetInput = {
            const expectedGeneratedProductConfigComponentSet_01 = {
              __typename: 'GeneratedProductConfigSet', // TODO: REMOVE
              // comes from the ConfigSet that is stored in the product
              position: productToCheck.configSets[0].position,
              // comes from the productComponentSet itself (referenced by productSetId)
              name: {
                ...expectedCompSet_01.name,
                __typename: 'LocalizedItem', // TODO: REMOVE
              },
              description: expectedCompSet_01.description,
              type: expectedCompSet_01.type,
              maxSelection: expectedCompSet_01.maxSelection,
              items: [
                {
                  __typename: 'GeneratedProductConfigComponent', // TODO: REMOVE
                  // comes from the ConfigComponent that is stored in the product's config set
                  productComponentId:
                    productToCheck.configSets[0].items[0].productComponentId,
                  price: productToCheck.configSets[0].items[0].price,
                  position: productToCheck.configSets[0].items[0].position,
                  // comes from the productComponent itself (referenced by productComponentId)
                  name: {
                    ...expectedComp_0_0.name,
                    __typename: 'LocalizedItem', // TODO: REMOVE
                  },
                  description: expectedComp_0_0.description,
                  allergens: expectedComp_0_0.allergens,
                },
                {
                  __typename: 'GeneratedProductConfigComponent', // TODO: REMOVE
                  // comes from the ConfigComponent that is stored in the product's config set
                  productComponentId:
                    productToCheck.configSets[0].items[1].productComponentId,
                  price: productToCheck.configSets[0].items[1].price,
                  position: productToCheck.configSets[0].items[1].position,
                  // comes from the productComponent itself (referenced by productComponentId)
                  name: {
                    ...expectedComp_0_1.name,
                    __typename: 'LocalizedItem', // TODO: REMOVE
                  },
                  description: expectedComp_0_1.description,
                  allergens: expectedComp_0_1.allergens,
                },
              ],
            };
            expect(aGeneratedProduct.configSets[0]).toEqual(
              expectedGeneratedProductConfigComponentSet_01,
            );
          },
        }),
      )
      // execute func
      .subscribe({
        next() {
          done();
        },
        error(err) {
          console.error(`${TEST_NAME}Test ERROR`, err);
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
