import {
  Allergen,
  AvailabilityInput,
  ProductType,
  ServingMode,
} from '@bgap/domain';
import { seededIdPrefix } from './common';

const chainProductId_01 = `${seededIdPrefix}chain_product_c1_1_id`;
const chainProductId_02 = `${seededIdPrefix}chain_product_c1_2_id`;
const chainProductId_03 = `${seededIdPrefix}chain_product_c1_3_id`;
const chainProductId_04 = `${seededIdPrefix}chain_product_c1_4_id`;
const chainProductId_05 = `${seededIdPrefix}chain_product_c1_5_id`;
const chainProductId_06 = `${seededIdPrefix}chain_product_c1_6_id`;
const chainProductId_07 = `${seededIdPrefix}chain_product_c1_7_id`;
const chainProductId_08 = `${seededIdPrefix}chain_product_c1_8_id`;
const chainProductId_09 = `${seededIdPrefix}chain_product_c1_9_id`;
const chainProductId_10 = `${seededIdPrefix}chain_product_c1_10_id`;
const chainProductId_11 = `${seededIdPrefix}chain_product_c1_11_id`;
const chainProductId_12 = `${seededIdPrefix}chain_product_c1_12_id`;
const chainProductId_13 = `${seededIdPrefix}chain_product_c1_13_id`;
const chainProductId_14 = `${seededIdPrefix}chain_product_c1_14_id`;
const chainProductId_15 = `${seededIdPrefix}chain_product_c1_15_id`;

const groupProductId_01 = `${seededIdPrefix}chain_product_c1_g1_1_id`;
const groupProductId_02 = `${seededIdPrefix}chain_product_c1_g1_2_id`;
const groupProductId_03 = `${seededIdPrefix}chain_product_c1_g1_3_id`;
const groupProductId_04 = `${seededIdPrefix}chain_product_c1_g1_4_id`;
const groupProductId_05 = `${seededIdPrefix}chain_product_c1_g1_5_id`;
const groupProductId_06 = `${seededIdPrefix}chain_product_c1_g1_6_id`;
const groupProductId_07 = `${seededIdPrefix}chain_product_c1_g1_7_id`;
const groupProductId_08 = `${seededIdPrefix}chain_product_c1_g1_8_id`;
const groupProductId_09 = `${seededIdPrefix}chain_product_c1_g1_9_id`;
const groupProductId_10 = `${seededIdPrefix}chain_product_c1_g1_10_id`;
const groupProductId_11 = `${seededIdPrefix}chain_product_c1_g1_11_id`;
const groupProductId_12 = `${seededIdPrefix}chain_product_c1_g1_12_id`;
const groupProductId_13 = `${seededIdPrefix}chain_product_c1_g1_13_id`;
const groupProductId_14 = `${seededIdPrefix}chain_product_c1_g1_14_id`;
const groupProductId_15 = `${seededIdPrefix}chain_product_c1_g1_15_id`;

const unitProductId_01 = `${seededIdPrefix}unit_product_c1_g1_u1_1_id`;
const unitProductId_02 = `${seededIdPrefix}unit_product_c1_g1_u1_2_id`;
const unitProductId_03 = `${seededIdPrefix}unit_product_c1_g1_u1_3_id`;
const unitProductId_04 = `${seededIdPrefix}unit_product_c1_g1_u1_4_id`;
const unitProductId_05 = `${seededIdPrefix}unit_product_c1_g1_u1_5_id`;
const unitProductId_06 = `${seededIdPrefix}unit_product_c1_g1_u1_6_id`;
const unitProductId_07 = `${seededIdPrefix}unit_product_c1_g1_u1_7_id`;
const unitProductId_08 = `${seededIdPrefix}unit_product_c1_g1_u1_8_id`;
const unitProductId_09 = `${seededIdPrefix}unit_product_c1_g1_u1_9_id`;
const unitProductId_10 = `${seededIdPrefix}unit_product_c1_g1_u1_10_id`;
const unitProductId_11 = `${seededIdPrefix}unit_product_c1_g1_u1_11_id`;
const unitProductId_12 = `${seededIdPrefix}unit_product_c1_g1_u1_12_id`;
const unitProductId_13 = `${seededIdPrefix}unit_product_c1_g1_u1_13_id`;
const unitProductId_14 = `${seededIdPrefix}unit_product_c1_g1_u1_14_id`;
const unitProductId_15 = `${seededIdPrefix}unit_product_c1_g1_u1_15_id`;

const chainProduct_1 = {
  id: chainProductId_01,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_31_id',
          refGroupPrice: 0,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_32_id',
          refGroupPrice: 0,
          position: 2,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_33_id',
          refGroupPrice: 0,
          position: 3,
          price: 0,
        },
      ],
      productSetId: 'seeded_product_component_set_03_id',
      position: 1,
    },
  ],
  productType: ProductType.food,
  variants: [
    {
      refGroupPrice: 0,
      isAvailable: true,
      price: 11,
      availabilities: [] as AvailabilityInput[],
      id: 'seeded_chain_product_variant_c1_p1_1_id',
      position: 10,
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
      refGroupPrice: 0,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: 'ec84f130-528b-11ec-afe3-15e1afd659e2',
      position: 0,
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
  isVisible: true,
  productCategoryId: 'seeded_product_category_c1_1_id',
  name: {
    de: 'Hamburger',
    en: 'Hamburger',
    hu: 'Hamburger',
  },
  chainId: 'seeded_chain_1_id',
  image: 'https://picsum.photos/200?random=1',
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
};

const chainProduct_2 = {
  id: chainProductId_02,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_31_id',
          refGroupPrice: 0,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_32_id',
          refGroupPrice: 0,
          position: 2,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_33_id',
          refGroupPrice: 0,
          position: 3,
          price: 0,
        },
      ],
      productSetId: 'seeded_product_component_set_03_id',
      position: 1,
    },
  ],
  productType: ProductType.food,
  variants: [
    {
      refGroupPrice: 0,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: '16853de0-528d-11ec-90c0-fdfe82b3802d',
      position: 0,
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
      refGroupPrice: 0,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: '1ce35690-528d-11ec-90c0-fdfe82b3802d',
      position: 0,
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
  isVisible: true,
  productCategoryId: 'seeded_product_category_c1_1_id',
  name: {
    de: 'Fishburger',
    en: 'Fishburger',
    hu: 'Halburger',
  },
  chainId: 'seeded_chain_1_id',
  image: 'https://picsum.photos/200?random=2',
  allergens: [
    Allergen.lupin,
    Allergen.molluscs,
    Allergen.crustaceans,
    Allergen.egg,
    Allergen.soya,
    Allergen.sesame,
    Allergen.fish,
    Allergen.gluten,
  ],
  description: {
    de: 'sea fish burger',
    en: 'sea fish burger',
    hu: 'tengeri halas burger',
  },
};

const chainProduct_3 = {
  id: chainProductId_03,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_31_id',
          refGroupPrice: 0,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_32_id',
          refGroupPrice: 0,
          position: 2,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_33_id',
          refGroupPrice: 0,
          position: 3,
          price: 0,
        },
      ],
      productSetId: 'seeded_product_component_set_03_id',
      position: 1,
    },
  ],
  productType: ProductType.food,
  variants: [
    {
      refGroupPrice: 0,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: 'd22dee40-528b-11ec-afe3-15e1afd659e2',
      position: 0,
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
      refGroupPrice: 0,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: 'de590330-528b-11ec-afe3-15e1afd659e2',
      position: 0,
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
  isVisible: true,
  productCategoryId: 'seeded_product_category_c1_1_id',
  name: {
    de: 'Sajtburger',
    en: 'Sajtburger',
    hu: 'Sajtburger',
  },
  chainId: 'seeded_chain_1_id',
  image: 'https://picsum.photos/200?random=3',
  allergens: [Allergen.sesame],
  description: {
    de: 'sajtos szendvics',
    en: 'sajtos szendvics',
    hu: 'sajtos szendvics',
  },
};

const chainProduct_4 = {
  id: chainProductId_04,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_11_id',
          refGroupPrice: 0,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_12_id',
          refGroupPrice: 0,
          position: 2,
          price: 0,
        },
      ],
      productSetId: 'seeded_product_component_set_01_id',
      position: 1,
    },
  ],
  productType: ProductType.drink,
  variants: [
    {
      refGroupPrice: 0,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: '85322620-528f-11ec-90c0-fdfe82b3802d',
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
      refGroupPrice: 0,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: '858b1b90-528f-11ec-90c0-fdfe82b3802d',
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
      refGroupPrice: 0,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: '86353e40-528f-11ec-90c0-fdfe82b3802d',
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
  isVisible: true,
  productCategoryId: 'seeded_product_category_c1_3_id',
  name: {
    de: 'Kőbányai',
    en: 'Kőbányai',
    hu: 'Kőbányai',
  },
  chainId: 'seeded_chain_1_id',
  image: 'https://picsum.photos/200?random=4',
  allergens: [] as Allergen[],
  description: {
    de: 'lager beer',
    en: 'lager beer',
    hu: 'világos sör',
  },
};

const chainProduct_5 = {
  id: chainProductId_05,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_11_id',
          refGroupPrice: 0,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_12_id',
          refGroupPrice: 0,
          position: 2,
          price: 0,
        },
      ],
      productSetId: 'seeded_product_component_set_01_id',
      position: 1,
    },
  ],
  productType: ProductType.drink,
  variants: [
    {
      refGroupPrice: 0,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: '4d498eb0-528f-11ec-90c0-fdfe82b3802d',
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
      refGroupPrice: 0,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: '4dc8a9c0-528f-11ec-90c0-fdfe82b3802d',
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
      refGroupPrice: 0,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: '4e2fa8f0-528f-11ec-90c0-fdfe82b3802d',
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
  isVisible: true,
  productCategoryId: 'seeded_product_category_c1_3_id',
  name: {
    de: 'HB',
    en: 'HB',
    hu: 'HB',
  },
  chainId: 'seeded_chain_1_id',
  image: 'https://picsum.photos/200?random=5',
  allergens: [] as Allergen[],
  description: {
    de: 'lager beer',
    en: 'lager beer',
    hu: 'világos sör',
  },
};

const chainProduct_6 = {
  id: chainProductId_06,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_11_id',
          refGroupPrice: 0,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_12_id',
          refGroupPrice: 0,
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
          refGroupPrice: 0,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_22_id',
          refGroupPrice: 0,
          position: 2,
          price: 0,
        },
      ],
      productSetId: 'seeded_product_component_set_02_id',
      position: 2,
    },
  ],
  productType: ProductType.food,
  variants: [
    {
      refGroupPrice: 0,
      isAvailable: true,
      price: 11,
      availabilities: [] as AvailabilityInput[],
      id: 'seeded_chain_product_variant_c1_p3_1_id',
      position: 10,
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
      refGroupPrice: 0,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: '3a20c280-528b-11ec-afe3-15e1afd659e2',
      position: 0,
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
  isVisible: true,
  productCategoryId: 'seeded_product_category_c1_2_id',
  name: {
    de: 'Coca-Cola',
    en: 'Coca-Cola',
    hu: 'Coca-Cola',
  },
  chainId: 'seeded_chain_1_id',
  image: 'https://picsum.photos/200?random=6',
  allergens: [Allergen.egg, Allergen.gluten, Allergen.peanut],
  description: {
    de: 'klasszikus íz',
    en: 'klasszikus íz',
    hu: 'klasszikus íz',
  },
};

const chainProduct_7 = {
  id: chainProductId_07,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_11_id',
          refGroupPrice: 0,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_12_id',
          refGroupPrice: 0,
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
          refGroupPrice: 0,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_22_id',
          refGroupPrice: 0,
          position: 2,
          price: 0,
        },
      ],
      productSetId: 'seeded_product_component_set_02_id',
      position: 2,
    },
  ],
  productType: ProductType.drink,
  variants: [
    {
      refGroupPrice: 0,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: 'f1200050-528f-11ec-90c0-fdfe82b3802d',
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
      refGroupPrice: 0,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: 'f1c6a090-528f-11ec-90c0-fdfe82b3802d',
      position: 0,
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
  isVisible: true,
  productCategoryId: 'seeded_product_category_c1_2_id',
  name: {
    de: 'Sprite',
    en: 'Sprite',
    hu: 'Sprite',
  },
  chainId: 'seeded_chain_1_id',
  image: 'https://picsum.photos/200?random=7',
  allergens: [Allergen.sulphites],
  description: {
    de: 'soda-pop',
    en: 'soda-pop',
    hu: 'szénsavas üdítő',
  },
};

const chainProduct_8 = {
  id: chainProductId_08,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_11_id',
          refGroupPrice: 0,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_12_id',
          refGroupPrice: 0,
          position: 2,
          price: 0,
        },
      ],
      productSetId: 'seeded_product_component_set_01_id',
      position: 1,
    },
  ],
  productType: ProductType.drink,
  variants: [
    {
      refGroupPrice: 0,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: '065caaa0-528f-11ec-90c0-fdfe82b3802d',
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
      refGroupPrice: 0,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: '0c565c30-528f-11ec-90c0-fdfe82b3802d',
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
      refGroupPrice: 0,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: '13eaaaf0-528f-11ec-90c0-fdfe82b3802d',
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
  isVisible: true,
  productCategoryId: 'seeded_product_category_c1_3_id',
  name: {
    de: 'Dreher',
    en: 'Dreher',
    hu: 'Dreher',
  },
  chainId: 'seeded_chain_1_id',
  image: 'https://picsum.photos/200?random=8',
  allergens: [] as Allergen[],
  description: {
    de: 'lager beer',
    en: 'lager beer',
    hu: 'világos sör',
  },
};

const chainProduct_9 = {
  id: chainProductId_09,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_11_id',
          refGroupPrice: 0,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_12_id',
          refGroupPrice: 0,
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
          refGroupPrice: 0,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_22_id',
          refGroupPrice: 0,
          position: 2,
          price: 0,
        },
      ],
      productSetId: 'seeded_product_component_set_02_id',
      position: 2,
    },
  ],
  productType: ProductType.drink,
  variants: [
    {
      refGroupPrice: 0,
      isAvailable: true,
      price: 11,
      availabilities: [] as AvailabilityInput[],
      id: 'seeded_chain_product_variant_c1_p2_1_id',
      position: 10,
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
      refGroupPrice: 0,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: 'af36ee60-528a-11ec-afe3-15e1afd659e2',
      position: 0,
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
  isVisible: true,
  productCategoryId: 'seeded_product_category_c1_2_id',
  name: {
    de: 'Fanta',
    en: 'Fanta',
    hu: 'Fanta',
  },
  chainId: 'seeded_chain_1_id',
  image: 'https://picsum.photos/200?random=9',
  allergens: [Allergen.sulphites],
  description: {
    de: 'orange drink',
    en: 'orange drink',
    hu: 'narancsos üdítő',
  },
};

const groupProduct_1 = {
  id: groupProductId_01,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_31_id',
          refGroupPrice: 500,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_32_id',
          refGroupPrice: 500,
          position: 2,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_33_id',
          refGroupPrice: 500,
          position: 3,
          price: 0,
        },
      ],
      productSetId: 'seeded_product_component_set_03_id',
      position: 1,
    },
  ],
  takeawayTax: 20,
  variants: [
    {
      refGroupPrice: 1200,
      isAvailable: true,
      price: 11,
      availabilities: [] as AvailabilityInput[],
      id: 'seeded_chain_product_variant_c1_p1_1_id',
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
      refGroupPrice: 1500,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: 'ec84f130-528b-11ec-afe3-15e1afd659e2',
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
  groupId: 'seeded_group_c1_1_id',
  tax: 27,
  parentId: chainProductId_01,
  isVisible: true,
  chainId: 'seeded_chain_1_id',
};

const groupProduct_2 = {
  id: groupProductId_02,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_11_id',
          refGroupPrice: 0,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_12_id',
          refGroupPrice: 0,
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
          refGroupPrice: 50,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_22_id',
          refGroupPrice: 200,
          position: 2,
          price: 0,
        },
      ],
      productSetId: 'seeded_product_component_set_02_id',
      position: 2,
    },
  ],
  takeawayTax: 20,
  variants: [
    {
      refGroupPrice: 300,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: 'f1200050-528f-11ec-90c0-fdfe82b3802d',
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
      refGroupPrice: 500,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: 'f1c6a090-528f-11ec-90c0-fdfe82b3802d',
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
  groupId: 'seeded_group_c1_1_id',
  tax: 27,
  parentId: chainProductId_07,
  isVisible: true,
  chainId: 'seeded_chain_1_id',
};

const groupProduct_3 = {
  id: groupProductId_03,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_11_id',
          refGroupPrice: 0,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_12_id',
          refGroupPrice: 0,
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
          refGroupPrice: 50,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_22_id',
          refGroupPrice: 100,
          position: 2,
          price: 0,
        },
      ],
      productSetId: 'seeded_product_component_set_02_id',
      position: 2,
    },
  ],
  takeawayTax: 20,
  variants: [
    {
      refGroupPrice: 300,
      isAvailable: true,
      price: 11,
      availabilities: [] as AvailabilityInput[],
      id: 'seeded_chain_product_variant_c1_p3_1_id',
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
      refGroupPrice: 500,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: '3a20c280-528b-11ec-afe3-15e1afd659e2',
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
  groupId: 'seeded_group_c1_1_id',
  tax: 27,
  parentId: chainProductId_06,
  isVisible: true,
  chainId: 'seeded_chain_1_id',
};

const groupProduct_4 = {
  id: groupProductId_04,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_11_id',
          refGroupPrice: 0,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_12_id',
          refGroupPrice: 0,
          position: 2,
          price: 0,
        },
      ],
      productSetId: 'seeded_product_component_set_01_id',
      position: 1,
    },
  ],
  takeawayTax: 20,
  variants: [
    {
      refGroupPrice: 400,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: '85322620-528f-11ec-90c0-fdfe82b3802d',
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
      refGroupPrice: 500,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: '858b1b90-528f-11ec-90c0-fdfe82b3802d',
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
      refGroupPrice: 600,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: '86353e40-528f-11ec-90c0-fdfe82b3802d',
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
  groupId: 'seeded_group_c1_1_id',
  tax: 27,
  parentId: chainProductId_04,
  isVisible: true,
  chainId: 'seeded_chain_1_id',
};

const groupProduct_5 = {
  id: groupProductId_05,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_11_id',
          refGroupPrice: 0,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_12_id',
          refGroupPrice: 0,
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
          refGroupPrice: 50,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_22_id',
          refGroupPrice: 200,
          position: 2,
          price: 0,
        },
      ],
      productSetId: 'seeded_product_component_set_02_id',
      position: 2,
    },
  ],
  takeawayTax: 20,
  variants: [
    {
      refGroupPrice: 300,
      isAvailable: true,
      price: 11,
      availabilities: [] as AvailabilityInput[],
      id: 'seeded_chain_product_variant_c1_p2_1_id',
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
      refGroupPrice: 500,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: 'af36ee60-528a-11ec-afe3-15e1afd659e2',
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
  groupId: 'seeded_group_c1_1_id',
  tax: 27,
  parentId: chainProductId_09,
  isVisible: true,
  chainId: 'seeded_chain_1_id',
};

const groupProduct_6 = {
  id: groupProductId_06,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_11_id',
          refGroupPrice: 0,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_12_id',
          refGroupPrice: 0,
          position: 2,
          price: 0,
        },
      ],
      productSetId: 'seeded_product_component_set_01_id',
      position: 1,
    },
  ],
  takeawayTax: 20,
  variants: [
    {
      refGroupPrice: 400,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: '065caaa0-528f-11ec-90c0-fdfe82b3802d',
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
      refGroupPrice: 500,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: '0c565c30-528f-11ec-90c0-fdfe82b3802d',
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
      refGroupPrice: 600,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: '13eaaaf0-528f-11ec-90c0-fdfe82b3802d',
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
  groupId: 'seeded_group_c1_1_id',
  tax: 27,
  parentId: chainProductId_08,
  isVisible: true,
  chainId: 'seeded_chain_1_id',
};

const groupProduct_7 = {
  id: groupProductId_07,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_31_id',
          refGroupPrice: 500,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_32_id',
          refGroupPrice: 500,
          position: 2,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_33_id',
          refGroupPrice: 500,
          position: 3,
          price: 0,
        },
      ],
      productSetId: 'seeded_product_component_set_03_id',
      position: 1,
    },
  ],
  takeawayTax: 20,
  variants: [
    {
      refGroupPrice: 1200,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: 'd22dee40-528b-11ec-afe3-15e1afd659e2',
      position: 0,
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
      refGroupPrice: 1500,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: 'de590330-528b-11ec-afe3-15e1afd659e2',
      position: 0,
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
  groupId: 'seeded_group_c1_1_id',
  tax: 27,
  parentId: chainProductId_03,
  isVisible: true,
  chainId: 'seeded_chain_1_id',
};

const groupProduct_8 = {
  id: groupProductId_08,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_11_id',
          refGroupPrice: 0,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_12_id',
          refGroupPrice: 0,
          position: 2,
          price: 0,
        },
      ],
      productSetId: 'seeded_product_component_set_01_id',
      position: 1,
    },
  ],
  takeawayTax: 20,
  variants: [
    {
      refGroupPrice: 400,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: '4d498eb0-528f-11ec-90c0-fdfe82b3802d',
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
      refGroupPrice: 500,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: '4dc8a9c0-528f-11ec-90c0-fdfe82b3802d',
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
      refGroupPrice: 600,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: '4e2fa8f0-528f-11ec-90c0-fdfe82b3802d',
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
  groupId: 'seeded_group_c1_1_id',
  tax: 27,
  parentId: chainProductId_05,
  isVisible: true,
  chainId: 'seeded_chain_1_id',
};

const groupProduct_9 = {
  id: groupProductId_09,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_31_id',
          refGroupPrice: 500,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_32_id',
          refGroupPrice: 500,
          position: 2,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_33_id',
          refGroupPrice: 500,
          position: 3,
          price: 0,
        },
      ],
      productSetId: 'seeded_product_component_set_03_id',
      position: 1,
    },
  ],
  takeawayTax: 20,
  variants: [
    {
      refGroupPrice: 1200,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: '16853de0-528d-11ec-90c0-fdfe82b3802d',
      position: 0,
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
      refGroupPrice: 1500,
      isAvailable: true,
      price: 0,
      availabilities: [] as AvailabilityInput[],
      id: '1ce35690-528d-11ec-90c0-fdfe82b3802d',
      position: 0,
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
  groupId: 'seeded_group_c1_1_id',
  tax: 27,
  parentId: chainProductId_02,
  isVisible: true,
  chainId: 'seeded_chain_1_id',
};

const unitProduct_1 = {
  id: unitProductId_01,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_11_id',
          refGroupPrice: 0,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_12_id',
          refGroupPrice: 0,
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
          refGroupPrice: 50,
          position: 1,
          price: 50,
        },
        {
          productComponentId: 'seeded_product_component_22_id',
          refGroupPrice: 200,
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
      refGroupPrice: 300,
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
      id: 'seeded_chain_product_variant_c1_p2_1_id',
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
      refGroupPrice: 500,
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
      id: 'af36ee60-528a-11ec-afe3-15e1afd659e2',
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
  groupId: 'seeded_group_c1_1_id',
  parentId: groupProductId_05,
  takeaway: true,
  isVisible: true,
  unitId: 'seeded_unit_c1_g1_1_id',
  chainId: 'seeded_chain_1_id',
  laneId: 'lane_01',
  position: 0,
};

const unitProduct_2 = {
  id: unitProductId_02,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_31_id',
          refGroupPrice: 500,
          position: 1,
          price: 500,
        },
        {
          productComponentId: 'seeded_product_component_32_id',
          refGroupPrice: 500,
          position: 2,
          price: 500,
        },
        {
          productComponentId: 'seeded_product_component_33_id',
          refGroupPrice: 500,
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
      refGroupPrice: 1200,
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
      id: 'seeded_chain_product_variant_c1_p1_1_id',
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
      refGroupPrice: 1500,
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
      id: 'ec84f130-528b-11ec-afe3-15e1afd659e2',
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
  groupId: 'seeded_group_c1_1_id',
  parentId: groupProductId_01,
  takeaway: true,
  isVisible: true,
  unitId: 'seeded_unit_c1_g1_1_id',
  chainId: 'seeded_chain_1_id',
  laneId: 'lane_02',
  position: 0,
};

const unitProduct_3 = {
  id: unitProductId_03,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_11_id',
          refGroupPrice: 0,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_12_id',
          refGroupPrice: 0,
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
      refGroupPrice: 400,
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
      id: '85322620-528f-11ec-90c0-fdfe82b3802d',
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
      refGroupPrice: 500,
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
      id: '858b1b90-528f-11ec-90c0-fdfe82b3802d',
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
      refGroupPrice: 600,
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
      id: '86353e40-528f-11ec-90c0-fdfe82b3802d',
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
  groupId: 'seeded_group_c1_1_id',
  parentId: groupProductId_04,
  takeaway: true,
  isVisible: true,
  unitId: 'seeded_unit_c1_g1_1_id',
  chainId: 'seeded_chain_1_id',
  laneId: 'lane_01',
  position: 0,
};

const unitProduct_4 = {
  id: unitProductId_04,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_31_id',
          refGroupPrice: 500,
          position: 1,
          price: 500,
        },
        {
          productComponentId: 'seeded_product_component_32_id',
          refGroupPrice: 500,
          position: 2,
          price: 500,
        },
        {
          productComponentId: 'seeded_product_component_33_id',
          refGroupPrice: 500,
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
      refGroupPrice: 1200,
      isAvailable: true,
      price: 0,
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
      id: '16853de0-528d-11ec-90c0-fdfe82b3802d',
      position: 0,
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
      refGroupPrice: 1500,
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
      id: '1ce35690-528d-11ec-90c0-fdfe82b3802d',
      position: 0,
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
  groupId: 'seeded_group_c1_1_id',
  parentId: groupProductId_09,
  takeaway: true,
  isVisible: true,
  unitId: 'seeded_unit_c1_g1_1_id',
  chainId: 'seeded_chain_1_id',
  laneId: 'lane_01',
  position: 0,
};

const unitProduct_5 = {
  id: unitProductId_05,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_11_id',
          refGroupPrice: 0,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_12_id',
          refGroupPrice: 0,
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
      refGroupPrice: 400,
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
      id: '4d498eb0-528f-11ec-90c0-fdfe82b3802d',
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
      refGroupPrice: 500,
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
      id: '4dc8a9c0-528f-11ec-90c0-fdfe82b3802d',
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
      refGroupPrice: 600,
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
      id: '4e2fa8f0-528f-11ec-90c0-fdfe82b3802d',
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
  groupId: 'seeded_group_c1_1_id',
  parentId: groupProductId_08,
  takeaway: true,
  isVisible: true,
  unitId: 'seeded_unit_c1_g1_1_id',
  chainId: 'seeded_chain_1_id',
  laneId: 'lane_01',
  position: 0,
};

const unitProduct_6 = {
  id: unitProductId_06,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_11_id',
          refGroupPrice: 0,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_12_id',
          refGroupPrice: 0,
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
      refGroupPrice: 400,
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
      id: '065caaa0-528f-11ec-90c0-fdfe82b3802d',
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
      refGroupPrice: 500,
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
      id: '0c565c30-528f-11ec-90c0-fdfe82b3802d',
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
      refGroupPrice: 600,
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
      id: '13eaaaf0-528f-11ec-90c0-fdfe82b3802d',
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
  groupId: 'seeded_group_c1_1_id',
  parentId: groupProductId_06,
  takeaway: true,
  isVisible: true,
  unitId: 'seeded_unit_c1_g1_1_id',
  chainId: 'seeded_chain_1_id',
  laneId: 'lane_01',
  position: 0,
};

const unitProduct_7 = {
  id: unitProductId_07,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_11_id',
          refGroupPrice: 0,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_12_id',
          refGroupPrice: 0,
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
          refGroupPrice: 50,
          position: 1,
          price: 50,
        },
        {
          productComponentId: 'seeded_product_component_22_id',
          refGroupPrice: 200,
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
      refGroupPrice: 300,
      isAvailable: true,
      price: 0,
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
      id: 'f1200050-528f-11ec-90c0-fdfe82b3802d',
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
      refGroupPrice: 500,
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
      id: 'f1c6a090-528f-11ec-90c0-fdfe82b3802d',
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
  groupId: 'seeded_group_c1_1_id',
  parentId: groupProductId_02,
  takeaway: true,
  isVisible: true,
  unitId: 'seeded_unit_c1_g1_1_id',
  chainId: 'seeded_chain_1_id',
  laneId: 'lane_01',
  position: 0,
};

const unitProduct_8 = {
  id: unitProductId_08,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_11_id',
          refGroupPrice: 0,
          position: 1,
          price: 0,
        },
        {
          productComponentId: 'seeded_product_component_12_id',
          refGroupPrice: 0,
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
          refGroupPrice: 50,
          position: 1,
          price: 50,
        },
        {
          productComponentId: 'seeded_product_component_22_id',
          refGroupPrice: 100,
          position: 2,
          price: 100,
        },
      ],
      productSetId: 'seeded_product_component_set_02_id',
      position: 2,
    },
  ],
  supportedServingModes: [ServingMode.inplace, ServingMode.takeaway],
  variants: [
    {
      refGroupPrice: 300,
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
      id: 'seeded_chain_product_variant_c1_p3_1_id',
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
      refGroupPrice: 500,
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
      id: '3a20c280-528b-11ec-afe3-15e1afd659e2',
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
  groupId: 'seeded_group_c1_1_id',
  parentId: groupProductId_03,
  takeaway: true,
  isVisible: true,
  unitId: 'seeded_unit_c1_g1_1_id',
  chainId: 'seeded_chain_1_id',
  laneId: 'lane_01',
  position: 0,
};

const unitProduct_9 = {
  id: unitProductId_09,
  configSets: [
    {
      items: [
        {
          productComponentId: 'seeded_product_component_31_id',
          refGroupPrice: 500,
          position: 1,
          price: 500,
        },
        {
          productComponentId: 'seeded_product_component_32_id',
          refGroupPrice: 500,
          position: 2,
          price: 500,
        },
        {
          productComponentId: 'seeded_product_component_33_id',
          refGroupPrice: 500,
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
      refGroupPrice: 1200,
      isAvailable: true,
      price: 0,
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
      id: 'd22dee40-528b-11ec-afe3-15e1afd659e2',
      position: 0,
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
      refGroupPrice: 1500,
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
      id: 'de590330-528b-11ec-afe3-15e1afd659e2',
      position: 0,
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
  groupId: 'seeded_group_c1_1_id',
  parentId: groupProductId_07,
  takeaway: true,
  isVisible: true,
  unitId: 'seeded_unit_c1_g1_1_id',
  chainId: 'seeded_chain_1_id',
  laneId: 'lane_01',
  position: 0,
};

// SEED more mocks

const chainProduct_10 = {
  ...chainProduct_9,
  id: chainProductId_10,
};

const chainProduct_11 = {
  ...chainProduct_9,
  id: chainProductId_11,
};

const chainProduct_12 = {
  ...chainProduct_9,
  id: chainProductId_12,
};

const chainProduct_13 = {
  ...chainProduct_9,
  id: chainProductId_13,
};

const chainProduct_14 = {
  ...chainProduct_9,
  id: chainProductId_14,
};

const chainProduct_15 = {
  ...chainProduct_9,
  id: chainProductId_15,
};

const groupProduct_10 = {
  ...groupProduct_9,
  id: groupProductId_10,
};

const groupProduct_11 = {
  ...groupProduct_9,
  id: groupProductId_11,
};

const groupProduct_12 = {
  ...groupProduct_9,
  id: groupProductId_12,
};

const groupProduct_13 = {
  ...groupProduct_9,
  id: groupProductId_13,
};

const groupProduct_14 = {
  ...groupProduct_9,
  id: groupProductId_14,
};

const groupProduct_15 = {
  ...groupProduct_9,
  id: groupProductId_15,
};

const unitProduct_10 = {
  ...unitProduct_9,
  id: unitProductId_10,
};

const unitProduct_11 = {
  ...unitProduct_9,
  id: unitProductId_11,
};

const unitProduct_12 = {
  ...unitProduct_9,
  id: unitProductId_12,
};

const unitProduct_13 = {
  ...unitProduct_9,
  id: unitProductId_13,
};

const unitProduct_14 = {
  ...unitProduct_9,
  id: unitProductId_14,
};

const unitProduct_15 = {
  ...unitProduct_9,
  id: unitProductId_15,
};

export const productSnapshotFixture = {
  chainProduct_1,
  chainProduct_2,
  chainProduct_3,
  chainProduct_4,
  chainProduct_5,
  chainProduct_6,
  chainProduct_7,
  chainProduct_8,
  chainProduct_9,
  chainProduct_10,
  chainProduct_11,
  chainProduct_12,
  chainProduct_13,
  chainProduct_14,
  chainProduct_15,
  groupProduct_1,
  groupProduct_2,
  groupProduct_3,
  groupProduct_4,
  groupProduct_5,
  groupProduct_6,
  groupProduct_7,
  groupProduct_8,
  groupProduct_9,
  groupProduct_10,
  groupProduct_11,
  groupProduct_12,
  groupProduct_13,
  groupProduct_14,
  groupProduct_15,
  unitProduct_1,
  unitProduct_2,
  unitProduct_3,
  unitProduct_4,
  unitProduct_5,
  unitProduct_6,
  unitProduct_7,
  unitProduct_8,
  unitProduct_9,
  unitProduct_10,
  unitProduct_11,
  unitProduct_12,
  unitProduct_13,
  unitProduct_14,
  unitProduct_15,
};
