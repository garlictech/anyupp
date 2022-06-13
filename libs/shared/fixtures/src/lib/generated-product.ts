import {
  Allergen,
  GeneratedProduct,
  ProductType,
  ServingMode,
} from '@bgap/domain';
import { testIdPrefix } from './common';

const getGeneratedProductVariant = (idx: number, productId?: string) => ({
  id: `${testIdPrefix}generatedProductVariant_id_p${productId}_${idx}`,
  variantName: {
    en: `VARIANT_NAME_${productId || idx}`,
    hu: `VARIANT_NAME_${productId || idx}`,
  },
  pack: { size: idx, unit: 'UNIT' },
  price: idx,
  position: idx,
  netPackagingFee: 1,
});

const getGeneratedProduct = ({
  id,
  unitId,
  productCategoryId,
}: {
  id: string;
  unitId: string;
  productCategoryId: string;
}) => ({
  ...generatedProductBase,
  id,
  unitId,
  productCategoryId,
  name: { en: `GENERATED_PRODUCT_${id}`, hu: `GENERALT_TERMEK_${id}` },
  description: {
    en: `GENERATED_PRODUCT DESCRIPTION ${id}`,
    hu: `GENERALT_TERMEK  LEIRAS ${id}`,
  },
  variants: [
    getGeneratedProductVariant(1, id),
    getGeneratedProductVariant(2, id),
  ],
  image: 'https://picsum.photos/100',
});

const generatedProductBase = {
  id: `${testIdPrefix}generatedProduct_id_`,
  unitId: 'unitId_',
  productCategoryId: 'productCategoryId_',
  name: { en: 'GENERATED_PRODUCT', hu: 'GENERALT_TERMEK' },
  description: { en: 'DESCRIPTION', hu: 'LEIRAS' },
  productType: ProductType.drink,
  tax: 1,
  position: 1,
  image: 'https://picsum.photos/100',
  variants: [getGeneratedProductVariant(1), getGeneratedProductVariant(2)],
  allergens: [
    Allergen.egg,
    Allergen.gluten,
    Allergen.milk,
    Allergen.soya,
    Allergen.peanut,
  ],
  supportedServingModes: [ServingMode.inplace],
  takeawayTax: 2,
};

const generatedDrinkProduct: GeneratedProduct = {
  ...generatedProductBase,
  id: `${testIdPrefix}_generated_product_id_1`,
  productType: ProductType.drink,
  createdAt: '',
  updatedAt: '',
};

const generatedFoodProduct: GeneratedProduct = {
  ...generatedProductBase,
  id: `${testIdPrefix}_generated_product_id_2`,
  productType: ProductType.food,
  createdAt: '',
  updatedAt: '',
};

export const generatedProductFixture = {
  base: generatedProductBase,
  getGeneratedProduct,
  generatedDrinkProduct,
  generatedFoodProduct,
};
