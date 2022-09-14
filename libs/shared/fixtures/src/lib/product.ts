import {
  Allergen,
  CreateUnitProductInput,
  ProductType,
  ServingMode,
} from '@bgap/domain';

import { v1 as uuid } from 'uuid';

export const createProductFixture = (
  unitId: string,
  productCategoryId: string,
): CreateUnitProductInput => ({
  id: 'kesdobalo_product_hambi',
  unitId,
  laneId: 'lane_01',
  isVisible: true,
  takeaway: false,
  supportedServingModes: [ServingMode.takeaway],
  position: 0,
  takeawayTax: 20,
  tax: 27,
  image:
    'https://archive.canadianbusiness.com/wp-content/uploads/2013/04/oldhamburger.jpg',
  name: {
    de: 'Hamburger',
    en: 'Hamburger',
    hu: 'Hamburger',
  },
  productCategoryId,
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
  variants: [
    {
      id: uuid(),
      isAvailable: true,
      price: 150,
      position: 1,
      pack: {
        size: 1,
        unit: 'db',
      },
      variantName: {
        en: 'piece',
        hu: 'darab',
      },
    },
  ],
  configSets: [],
});
