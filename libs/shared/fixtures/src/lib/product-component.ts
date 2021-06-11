import * as CrudApi from '@bgap/crud-gql/api';
import { EProductComponentSetType, RequiredId } from '@bgap/shared/types';

import { chainFixture } from './chain';
import { seededIdPrefix, testIdPrefix } from './common';

const prodCompId_01 = `${seededIdPrefix}product_component_01_id`;
const prodCompId_02 = `${seededIdPrefix}product_component_02_id`;
const prodCompId_03 = `${seededIdPrefix}product_component_03_id`;
const prodCompSetId_01 = `${seededIdPrefix}product_component_set_01_id`;
const prodCompSetId_02 = `${seededIdPrefix}product_component_set_02_id`;

const getProductComponent = ({
  id,
}: {
  id: string;
}): RequiredId<CrudApi.CreateProductComponentInput> => ({
  ...productComponentBase,
  id,
  name: {
    en: `PRODUCT_COMPONENT_${id}`,
    de: `PRODUCT_COMPONENT_${id}`,
    hu: `TERMEK_KOMPONENS_${id}`,
  },
  description: `PRODUCT_COMPONENT DESCRIPTION ${id}`,
});

const productComponentBase: RequiredId<CrudApi.CreateProductComponentInput> = {
  id: `${testIdPrefix}product_component_id_`,
  chainId: 'chainId_',
  name: {
    en: 'PRODUCT_COMPONENT',
    de: 'PRODUCT_COMPONENT',
    hu: 'TERMEK_KOMPONENS',
  },
  description: 'DESCRIPTION',
  allergens: [
    CrudApi.Allergen.egg,
    CrudApi.Allergen.gluten,
    CrudApi.Allergen.milk,
    CrudApi.Allergen.soya,
    CrudApi.Allergen.peanut,
  ],
};

const getComponentSet = ({
  id,
  chainId,
  itemIds = [],
}: {
  id: string;
  chainId: string;
  itemIds: string[];
}): RequiredId<CrudApi.CreateProductComponentSetInput> => ({
  ...productComponentSetBase,
  id,
  items: itemIds,
  maxSelection: itemIds.length,
  chainId,
  name: {
    en: `PRODUCT_COMPONENT_SET_${id}`,
    de: `PRODUCT_COMPONENT_SET_${id}`,
    hu: `KOMPONENS_SET_${id}`,
  },
  description: `PRODUCT_COMPONENT DESCRIPTION ${id}`,
});

const productComponentSetBase: Omit<
  RequiredId<CrudApi.CreateProductComponentSetInput>,
  'chainId'
> = {
  id: `${testIdPrefix}product_component_set_id_`,
  name: { en: 'COMPONENT_SET', de: 'COMPONENT_SET', hu: 'KOMPONENS_SET' },
  description: 'DESCRIPTION',
  type: EProductComponentSetType.EXTRAS,
  items: [],
  maxSelection: 0,
};

const seededProdComp_01: RequiredId<CrudApi.CreateProductComponentInput> = {
  ...getProductComponent({
    id: prodCompId_01,
  }),
  chainId: chainFixture.chainId_seeded_01,
};
const seededProdComp_02: RequiredId<CrudApi.CreateProductComponentInput> = {
  ...getProductComponent({
    id: prodCompId_02,
  }),
  chainId: chainFixture.chainId_seeded_01,
  allergens: [CrudApi.Allergen.sesame, CrudApi.Allergen.treenuts],
};
const seededProdComp_03: RequiredId<CrudApi.CreateProductComponentInput> = {
  ...getProductComponent({
    id: prodCompId_03,
  }),
  chainId: chainFixture.chainId_seeded_01,
  allergens: [CrudApi.Allergen.mustard],
};

const seededProdCompSet_01: RequiredId<CrudApi.CreateProductComponentSetInput> =
  {
    ...getComponentSet({
      id: prodCompSetId_01,
      chainId: chainFixture.chainId_seeded_01,
      itemIds: [prodCompId_01, prodCompId_02],
    }),
    type: EProductComponentSetType.EXTRAS,
  };

const seededProdCompSet_02: RequiredId<CrudApi.CreateProductComponentSetInput> =
  {
    ...getComponentSet({
      id: prodCompSetId_02,
      chainId: chainFixture.chainId_seeded_01,
      itemIds: [prodCompId_01, prodCompId_02, prodCompId_03],
    }),
    type: EProductComponentSetType.MODIFIER,
  };

const chainConfigSets: CrudApi.ProductConfigSetInput[] = [
  {
    position: 1,
    productSetId: seededProdCompSet_01.id,
    items: [
      {
        position: 1,
        productComponentId: seededProdCompSet_01.items[0],
        refGroupPrice: 0,
        price: 0,
      },
      {
        position: 2,
        productComponentId: seededProdCompSet_01.items[1],
        refGroupPrice: 0,
        price: 0,
      },
    ],
  },
  {
    position: 2,
    productSetId: seededProdCompSet_02.id,
    items: [
      {
        position: 1,
        productComponentId: seededProdCompSet_02.items[0],
        refGroupPrice: 0,
        price: 0,
      },
      {
        position: 2,
        productComponentId: seededProdCompSet_02.items[1],
        refGroupPrice: 0,
        price: 0,
      },
      {
        position: 3,
        productComponentId: seededProdCompSet_02.items[2],
        refGroupPrice: 0,
        price: 0,
      },
    ],
  },
];
const groupConfigSets: CrudApi.ProductConfigSetInput[] = [
  {
    ...chainConfigSets[0],
    items: [
      {
        ...chainConfigSets[0].items[0],
        refGroupPrice: -1.5,
      },
      {
        ...chainConfigSets[0].items[1],
        refGroupPrice: 2.8,
      },
    ],
  },
  {
    ...chainConfigSets[1],
    items: [
      {
        ...chainConfigSets[1].items[0],
        refGroupPrice: 1,
      },
      {
        ...chainConfigSets[1].items[1],
        refGroupPrice: -1.8,
      },
      {
        ...chainConfigSets[1].items[2],
        refGroupPrice: 0,
      },
    ],
  },
];
const unitConfigSets: CrudApi.ProductConfigSetInput[] = [
  {
    ...groupConfigSets[0],
    items: [
      {
        ...groupConfigSets[0].items[0],
        price: groupConfigSets[0].items[0].refGroupPrice * 1.2,
      },
      {
        ...groupConfigSets[0].items[1],
        price: groupConfigSets[0].items[0].refGroupPrice * 1.2,
      },
    ],
  },
  {
    ...groupConfigSets[1],
    items: [
      {
        ...groupConfigSets[1].items[0],
        price: groupConfigSets[0].items[0].refGroupPrice * 1.2,
      },
      {
        ...groupConfigSets[1].items[1],
        price: groupConfigSets[0].items[0].refGroupPrice * 1.2,
      },
      {
        ...groupConfigSets[1].items[2],
        price: groupConfigSets[0].items[0].refGroupPrice * 1.2,
      },
    ],
  },
];

const generatedProductConfigSets: CrudApi.GeneratedProductConfigSetInput[] = [
  {
    // unitConfigSets[0] == seededProdComp_01
    productSetId: seededProdCompSet_01.id,
    position: unitConfigSets[0].position,
    name: seededProdCompSet_01.name,
    type: seededProdCompSet_01.type,
    maxSelection: seededProdCompSet_01.maxSelection,
    items: [
      {
        // unitConfigSets[0].items[0] == seededProdComp_01
        productComponentId: unitConfigSets[0].items[0].productComponentId,
        price: unitConfigSets[0].items[0].price,
        position: unitConfigSets[0].items[0].position,
        name: seededProdComp_01.name,
        allergens: seededProdComp_01.allergens,
      },
      {
        // unitConfigSets[0].items[1] == seededProdComp_02
        productComponentId: unitConfigSets[0].items[1].productComponentId,
        price: unitConfigSets[0].items[1].price,
        position: unitConfigSets[0].items[1].position,
        name: seededProdComp_02.name,
        allergens: seededProdComp_02.allergens,
      },
    ],
  },
  {
    // unitConfigSets[1] == seededProdComp_02
    productSetId: seededProdCompSet_02.id,
    position: unitConfigSets[1].position,
    name: seededProdCompSet_02.name,
    type: seededProdCompSet_02.type,
    maxSelection: seededProdCompSet_02.maxSelection,
    items: [
      {
        // unitConfigSets[1].items[0] == seededProdComp_01
        productComponentId: unitConfigSets[1].items[0].productComponentId,
        price: unitConfigSets[1].items[0].price,
        position: unitConfigSets[1].items[0].position,
        name: seededProdComp_01.name,
        allergens: seededProdComp_01.allergens,
      },
      {
        // unitConfigSets[1].items[1] == seededProdComp_02
        productComponentId: unitConfigSets[1].items[1].productComponentId,
        price: unitConfigSets[1].items[1].price,
        position: unitConfigSets[1].items[1].position,
        name: seededProdComp_02.name,
        allergens: seededProdComp_02.allergens,
      },
      {
        // unitConfigSets[1].items[2] == seededProdComp_03
        productComponentId: unitConfigSets[1].items[2].productComponentId,
        price: unitConfigSets[1].items[2].price,
        position: unitConfigSets[1].items[2].position,
        name: seededProdComp_03.name,
        allergens: seededProdComp_03.allergens,
      },
    ],
  },
];

export const productComponentSetFixture = {
  base: productComponentSetBase,
  getProductComponent,
  getComponentSet,
  seededProdComp_01,
  seededProdComp_02,
  seededProdComp_03,
  seededProdCompSet_01,
  seededProdCompSet_02,
  seededChainProductConfigSets: chainConfigSets,
  seededGroupProductConfigSets: groupConfigSets,
  seededUnitProductConfigSets: unitConfigSets,
  generatedProductConfigSets,
};
