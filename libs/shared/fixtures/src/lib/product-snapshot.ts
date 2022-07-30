import {
  Allergen,
  CreateUnitProductInput,
  ProductType,
  ServingMode,
} from '@bgap/domain';
import { seededIdPrefix } from './common';

const unitProductId_01 = `${seededIdPrefix}unit_product_u1_1_id`;
const unitProductId_02 = `${seededIdPrefix}unit_product_u1_2_id`;
const unitProductId_03 = `${seededIdPrefix}unit_product_u1_3_id`;

const unitProduct_1: CreateUnitProductInput = {
  id: unitProductId_01,
  takeawayTax: 20,
  tax: 27,
  image: 'https://picsum.photos/200?random=1',
  name: {
    de: 'Hamburger',
    en: 'Hamburger',
    hu: 'Hamburger',
  },
  productCategoryId: 'seeded_product_category_c1_1_id',
  productType: ProductType.food,
  allergens: [
    Allergen.egg,
    Allergen.gluten,
    Allergen.mustard,
    Allergen.milk,
    Allergen.soya,
    Allergen.fish,
    Allergen.sesame,
  ],
  description: {
    de: 'laktató szendvics',
    en: 'laktató szendvics',
    hu: 'laktató szendvics',
  },
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_11_id',
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_12_id',
          position: 2,
          price: 0,
        },
      ],
      productSetId: 'seeded_product_component_set_01_id',
      position: 1,
    },
    {
      items: [
        {
          productComponentId: 'seeded_product_component_21_id',
          position: 1,
          price: 50,
        },
        {
          productComponentId: 'seeded_product_component_22_id',
          position: 2,
          price: 200,
        },
      ],
      productSetId: 'seeded_product_component_set_02_id',
      position: 2,
    },
  ],
  supportedServingModes: [ServingMode.inplace, ServingMode.takeaway],
  variants: [
    {
      isAvailable: true,
      price: 11,
      availabilities: [
        {
          timeFrom: '',
          dayTo: '',
          dayFrom: '',
          timeTo: '',
          type: 'A',
          price: 300,
        },
      ],
      position: 1,
      variantName: {
        de: 'glass',
        en: 'glass',
        hu: 'pohár',
      },
      pack: {
        size: 2,
        unit: 'dl',
      },
    },
    {
      isAvailable: true,
      price: 500,
      availabilities: [
        {
          timeFrom: '',
          dayTo: '',
          dayFrom: '',
          timeTo: '',
          type: 'A',
          price: 500,
        },
      ],
      position: 2,
      variantName: {
        de: 'glass',
        en: 'glass',
        hu: 'üveg',
      },
      pack: {
        size: 5,
        unit: 'dl',
      },
    },
  ],
  takeaway: true,
  isVisible: true,
  unitId: 'seeded_unit_1_id',
  laneId: 'lane_01',
  position: 0,
};

const unitProduct_2: CreateUnitProductInput = {
  id: unitProductId_02,
  takeawayTax: 20,
  tax: 27,
  image: 'https://picsum.photos/200?random=1',
  name: {
    de: 'Hamburger',
    en: 'Hamburger',
    hu: 'Hamburger',
  },
  productCategoryId: 'seeded_product_category_c1_1_id',
  productType: ProductType.food,
  allergens: [
    Allergen.egg,
    Allergen.gluten,
    Allergen.mustard,
    Allergen.milk,
    Allergen.soya,
    Allergen.fish,
    Allergen.sesame,
  ],
  description: {
    de: 'laktató szendvics',
    en: 'laktató szendvics',
    hu: 'laktató szendvics',
  },
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_31_id',
          position: 1,
          price: 500,
        },
        {
          productComponentId: 'seeded_product_component_32_id',
          position: 2,
          price: 500,
        },
        {
          productComponentId: 'seeded_product_component_33_id',
          position: 3,
          price: 500,
        },
      ],
      productSetId: 'seeded_product_component_set_03_id',
      position: 1,
    },
  ],
  supportedServingModes: [ServingMode.inplace, ServingMode.takeaway],
  variants: [
    {
      isAvailable: true,
      price: 11,
      availabilities: [
        {
          timeFrom: '',
          dayTo: '',
          dayFrom: '',
          timeTo: '',
          type: 'A',
          price: 1200,
        },
      ],
      position: 1,
      variantName: {
        de: 'normal',
        en: 'normal',
        hu: 'normál',
      },
      pack: {
        size: 1,
        unit: 'db',
      },
    },
    {
      isAvailable: true,
      price: 0,
      availabilities: [
        {
          timeFrom: '',
          dayTo: '',
          dayFrom: '',
          timeTo: '',
          type: 'A',
          price: 1500,
        },
      ],
      position: 2,
      variantName: {
        de: 'double',
        en: 'double',
        hu: 'dupla',
      },
      pack: {
        size: 1,
        unit: 'db',
      },
    },
  ],
  takeaway: true,
  isVisible: true,
  unitId: 'seeded_unit_1_id',
  laneId: 'lane_02',
  position: 0,
};

const unitProduct_3: CreateUnitProductInput = {
  id: unitProductId_03,
  takeawayTax: 20,
  tax: 27,
  image: 'https://picsum.photos/200?random=1',
  name: {
    de: 'Hamburger',
    en: 'Hamburger',
    hu: 'Hamburger',
  },
  productCategoryId: 'seeded_product_category_c1_1_id',
  productType: ProductType.food,
  allergens: [
    Allergen.egg,
    Allergen.gluten,
    Allergen.mustard,
    Allergen.milk,
    Allergen.soya,
    Allergen.fish,
    Allergen.sesame,
  ],
  description: {
    de: 'laktató szendvics',
    en: 'laktató szendvics',
    hu: 'laktató szendvics',
  },
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_11_id',
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_12_id',
          position: 2,
          price: 0,
        },
      ],
      productSetId: 'seeded_product_component_set_01_id',
      position: 1,
    },
  ],
  supportedServingModes: [ServingMode.inplace, ServingMode.takeaway],
  variants: [
    {
      isAvailable: true,
      price: 0,
      availabilities: [
        {
          timeFrom: '',
          dayTo: '',
          dayFrom: '',
          timeTo: '',
          type: 'A',
          price: 400,
        },
      ],
      position: 0,
      variantName: {
        de: 'glass',
        en: 'glass',
        hu: 'pohár',
      },
      pack: {
        size: 2,
        unit: 'dl',
      },
    },
    {
      isAvailable: true,
      price: 0,
      availabilities: [
        {
          timeFrom: '',
          dayTo: '',
          dayFrom: '',
          timeTo: '',
          type: 'A',
          price: 500,
        },
      ],
      position: 0,
      variantName: {
        de: 'glass',
        en: 'glass',
        hu: 'pohár',
      },
      pack: {
        size: 3,
        unit: 'dl',
      },
    },
    {
      isAvailable: true,
      price: 0,
      availabilities: [
        {
          timeFrom: '',
          dayTo: '',
          dayFrom: '',
          timeTo: '',
          type: 'A',
          price: 600,
        },
      ],
      position: 0,
      variantName: {
        de: 'glass',
        en: 'glass',
        hu: 'pohár',
      },
      pack: {
        size: 4,
        unit: 'dl',
      },
    },
  ],
  takeaway: true,
  isVisible: true,
  unitId: 'seeded_unit_1_id',
  laneId: 'lane_01',
  position: 0,
};

export const productSnapshotFixture = {
  unitProduct_1,
  unitProduct_2,
  unitProduct_3,
};
