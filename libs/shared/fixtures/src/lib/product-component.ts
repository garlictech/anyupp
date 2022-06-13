import { defaultSupportedServingModes, RequiredId } from '@bgap/shared/types';
import {
  Allergen,
  CreateProductComponentInput,
  CreateProductComponentSetInput,
  GeneratedProductConfigSetInput,
  ProductComponentSetType,
  ProductConfigSetInput,
} from '@bgap/domain';
import { chainFixture } from './chain';
import { seededIdPrefix, testIdPrefix } from './common';

const prodCompId_11 = `${seededIdPrefix}product_component_11_id`;
const prodCompId_12 = `${seededIdPrefix}product_component_12_id`;
const prodCompId_21 = `${seededIdPrefix}product_component_21_id`;
const prodCompId_22 = `${seededIdPrefix}product_component_22_id`;
const prodCompId_31 = `${seededIdPrefix}product_component_31_id`;
const prodCompId_32 = `${seededIdPrefix}product_component_32_id`;
const prodCompId_33 = `${seededIdPrefix}product_component_33_id`;
const prodCompSetId_01 = `${seededIdPrefix}product_component_set_01_id`;
const prodCompSetId_02 = `${seededIdPrefix}product_component_set_02_id`;
const prodCompSetId_03 = `${seededIdPrefix}product_component_set_03_id`;

const getProductComponent = ({
  id,
}: {
  id: string;
}): RequiredId<CreateProductComponentInput> => ({
  ...productComponentBase,
  id,
  name: {
    en: `PRODUCT_COMPONENT_${id}`,
    de: `PRODUCT_COMPONENT_${id}`,
    hu: `TERMEK_KOMPONENS_${id}`,
  },
  description: `PRODUCT_COMPONENT DESCRIPTION ${id}`,
});

const productComponentBase: RequiredId<CreateProductComponentInput> = {
  id: `${testIdPrefix}product_component_id_`,
  chainId: 'chainId_',
  name: {
    en: 'PRODUCT_COMPONENT',
    de: 'PRODUCT_COMPONENT',
    hu: 'TERMEK_KOMPONENS',
  },
  description: 'DESCRIPTION',
  allergens: [
    Allergen.egg,
    Allergen.gluten,
    Allergen.milk,
    Allergen.soya,
    Allergen.peanut,
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
}): RequiredId<CreateProductComponentSetInput> => ({
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
  RequiredId<CreateProductComponentSetInput>,
  'chainId'
> = {
  id: `${testIdPrefix}product_component_set_id_`,
  name: { en: 'COMPONENT_SET', de: 'COMPONENT_SET', hu: 'KOMPONENS_SET' },
  description: 'DESCRIPTION',
  type: ProductComponentSetType.extras,
  items: [],
  maxSelection: 0,
};

const seededProdComp_11: RequiredId<CreateProductComponentInput> = {
  ...getProductComponent({
    id: prodCompId_11,
  }),
  name: {
    en: 'Room temperature',
    de: 'Room temperature',
    hu: 'Szobahőmérsékletű',
  },
  description: '20-25 °C',
  chainId: chainFixture.chainId_seeded_01,
};

const seededProdComp_12: RequiredId<CreateProductComponentInput> = {
  ...getProductComponent({
    id: prodCompId_12,
  }),
  name: {
    en: 'Cold',
    de: 'Cold',
    hu: 'Hideg',
  },
  description: '10-20 °C',
  chainId: chainFixture.chainId_seeded_01,
};

const seededProdComp_21: RequiredId<CreateProductComponentInput> = {
  ...getProductComponent({
    id: prodCompId_21,
  }),
  name: {
    en: 'Straw',
    de: 'Straw',
    hu: 'Szívószál',
  },
  description: 'Papír szívócső',
  chainId: chainFixture.chainId_seeded_01,
  allergens: [],
};

const seededProdComp_22: RequiredId<CreateProductComponentInput> = {
  ...getProductComponent({
    id: prodCompId_22,
  }),
  name: {
    en: 'Mint',
    de: 'Mint',
    hu: 'Menta levél',
  },
  description: 'Dekoráció',
  chainId: chainFixture.chainId_seeded_01,
  allergens: [],
};

const seededProdComp_31: RequiredId<CreateProductComponentInput> = {
  ...getProductComponent({
    id: prodCompId_31,
  }),
  name: {
    en: 'French fries',
    de: 'French fries',
    hu: 'Hasábburgonya',
  },
  description: 'Frissen szeletelve',
  chainId: chainFixture.chainId_seeded_01,
  allergens: [Allergen.mustard],
};

const seededProdComp_32: RequiredId<CreateProductComponentInput> = {
  ...getProductComponent({
    id: prodCompId_32,
  }),
  name: {
    en: 'Boiled potato',
    de: 'Boiled potato',
    hu: 'Főtt krumpli',
  },
  description: 'Frissen főzve',
  chainId: chainFixture.chainId_seeded_01,
  allergens: [Allergen.mustard],
};

const seededProdComp_33: RequiredId<CreateProductComponentInput> = {
  ...getProductComponent({
    id: prodCompId_33,
  }),
  name: {
    en: 'Rice',
    de: 'Rice',
    hu: 'Rizs',
  },
  description: 'Frissen főzve',
  chainId: chainFixture.chainId_seeded_01,
  allergens: [Allergen.mustard],
};

const seededProdCompSet_01: RequiredId<CreateProductComponentSetInput> = {
  ...getComponentSet({
    id: prodCompSetId_01,
    chainId: chainFixture.chainId_seeded_01,
    itemIds: [prodCompId_11, prodCompId_12],
  }),
  name: {
    en: `Temperature`,
    de: `Temperature`,
    hu: `Hőmérséklet`,
  },
  description: 'Tálalási hőmérséklet',
  type: ProductComponentSetType.modifier,
};

const seededProdCompSet_02: RequiredId<CreateProductComponentSetInput> = {
  ...getComponentSet({
    id: prodCompSetId_02,
    chainId: chainFixture.chainId_seeded_01,
    itemIds: [prodCompId_21, prodCompId_22],
  }),
  name: {
    en: `Decoration`,
    de: `Decoration`,
    hu: `Dekoráció`,
  },
  description: 'Szolíd elegancia',
  maxSelection: 2,
  type: ProductComponentSetType.extras,
};

const seededProdCompSet_03: RequiredId<CreateProductComponentSetInput> = {
  ...getComponentSet({
    id: prodCompSetId_03,
    chainId: chainFixture.chainId_seeded_01,
    itemIds: [prodCompId_31, prodCompId_32, prodCompId_33],
  }),
  name: {
    en: `Garnish`,
    de: `Garnish`,
    hu: `Köret`,
  },
  description: 'Köret módosító készlet',
  type: ProductComponentSetType.modifier,
};

const chainConfigSets: ProductConfigSetInput[] = [
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
    ],
  },
  {
    position: 3,
    productSetId: seededProdCompSet_03.id,
    items: [
      {
        position: 1,
        productComponentId: seededProdCompSet_03.items[0],
        refGroupPrice: 0,
        price: 0,
      },
      {
        position: 2,
        productComponentId: seededProdCompSet_03.items[1],
        refGroupPrice: 0,
        price: 0,
      },
      {
        position: 3,
        productComponentId: seededProdCompSet_03.items[2],
        refGroupPrice: 0,
        price: 0,
      },
    ],
  },
];

const groupConfigSets: ProductConfigSetInput[] = [
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
    ],
  },
  {
    ...chainConfigSets[2],
    items: [
      {
        ...chainConfigSets[2].items[0],
        refGroupPrice: 1,
      },
      {
        ...chainConfigSets[2].items[1],
        refGroupPrice: -1.8,
      },
      {
        ...chainConfigSets[2].items[2],
        refGroupPrice: 0,
      },
    ],
  },
];

const unitConfigSets: ProductConfigSetInput[] = [
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
    ],
  },
  {
    ...groupConfigSets[2],
    items: [
      {
        ...groupConfigSets[2].items[0],
        price: groupConfigSets[0].items[0].refGroupPrice * 1.2,
      },
      {
        ...groupConfigSets[2].items[1],
        price: groupConfigSets[0].items[0].refGroupPrice * 1.2,
      },
      {
        ...groupConfigSets[2].items[2],
        price: groupConfigSets[0].items[0].refGroupPrice * 1.2,
      },
    ],
  },
];

const generatedProductConfigSets: GeneratedProductConfigSetInput[] = [
  {
    productSetId: seededProdCompSet_01.id,
    position: unitConfigSets[0].position,
    name: seededProdCompSet_01.name,
    type: seededProdCompSet_01.type,
    maxSelection: seededProdCompSet_01.maxSelection,
    supportedServingModes: defaultSupportedServingModes,
    items: [
      {
        productComponentId: unitConfigSets[0].items[0].productComponentId,
        price: unitConfigSets[0].items[0].price,
        position: unitConfigSets[0].items[0].position,
        name: seededProdComp_11.name,
        allergens: seededProdComp_11.allergens,
      },
      {
        productComponentId: unitConfigSets[0].items[1].productComponentId,
        price: unitConfigSets[0].items[1].price,
        position: unitConfigSets[0].items[1].position,
        name: seededProdComp_12.name,
        allergens: seededProdComp_12.allergens,
      },
    ],
  },
  {
    productSetId: seededProdCompSet_02.id,
    position: unitConfigSets[1].position,
    name: seededProdCompSet_02.name,
    type: seededProdCompSet_02.type,
    maxSelection: seededProdCompSet_02.maxSelection,
    supportedServingModes: defaultSupportedServingModes,
    items: [
      {
        productComponentId: unitConfigSets[1].items[0].productComponentId,
        price: unitConfigSets[1].items[0].price,
        position: unitConfigSets[1].items[0].position,
        name: seededProdComp_21.name,
        allergens: seededProdComp_21.allergens,
      },
      {
        productComponentId: unitConfigSets[1].items[1].productComponentId,
        price: unitConfigSets[1].items[1].price,
        position: unitConfigSets[1].items[1].position,
        name: seededProdComp_22.name,
        allergens: seededProdComp_22.allergens,
      },
    ],
  },
  {
    productSetId: seededProdCompSet_03.id,
    position: unitConfigSets[2].position,
    name: seededProdCompSet_03.name,
    type: seededProdCompSet_03.type,
    maxSelection: seededProdCompSet_03.maxSelection,
    supportedServingModes: defaultSupportedServingModes,
    items: [
      {
        productComponentId: unitConfigSets[2].items[0].productComponentId,
        price: unitConfigSets[2].items[0].price,
        position: unitConfigSets[2].items[0].position,
        name: seededProdComp_31.name,
        allergens: seededProdComp_31.allergens,
      },
      {
        productComponentId: unitConfigSets[2].items[1].productComponentId,
        price: unitConfigSets[2].items[1].price,
        position: unitConfigSets[2].items[1].position,
        name: seededProdComp_32.name,
        allergens: seededProdComp_32.allergens,
      },
      {
        productComponentId: unitConfigSets[2].items[2].productComponentId,
        price: unitConfigSets[2].items[2].price,
        position: unitConfigSets[2].items[2].position,
        name: seededProdComp_33.name,
        allergens: seededProdComp_33.allergens,
      },
    ],
  },
];

export const productComponentSetFixture = {
  productComponentBase,
  productComponentSetBase,
  getProductComponent,
  getComponentSet,
  seededProdComp_11,
  seededProdComp_12,
  seededProdComp_21,
  seededProdComp_22,
  seededProdComp_31,
  seededProdComp_32,
  seededProdComp_33,
  seededProdCompSet_01,
  seededProdCompSet_02,
  seededProdCompSet_03,
  seededChainProductConfigSets: chainConfigSets,
  seededGroupProductConfigSets: groupConfigSets,
  seededUnitProductConfigSets: unitConfigSets,
  generatedProductConfigSets,
};
