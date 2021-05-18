import { CrudApi } from '@bgap/crud-gql/api';
import { testIdPrefix } from './common';

const getGeneratedProductVariant = (
  idx: number,
  productId?: string,
): CrudApi.GeneratedProductVariantInput => ({
  id: `${testIdPrefix}generatedProductVariant_id_p${productId}_${idx}`,
  variantName: {
    en: `VARIANT_NAME_${productId || idx}`,
    hu: `VARIANT_NAME_${productId || idx}`,
  },
  pack: { size: idx, unit: 'UNIT' },
  price: idx,
  position: idx,
});

const getGeneratedProduct = ({
  id,
  unitId,
  productCategoryId,
}: {
  id: string;
  unitId: string;
  productCategoryId: string;
}): CrudApi.CreateGeneratedProductInput => ({
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

const generatedProductBase: CrudApi.CreateGeneratedProductInput = {
  id: `${testIdPrefix}generatedProduct_id_`,
  unitId: 'unitId_',
  productCategoryId: 'productCategoryId_',
  name: { en: 'GENERATED_PRODUCT', hu: 'GENERALT_TERMEK' },
  description: { en: 'DESCRIPTION', hu: 'LEIRAS' },
  productType: 'PRODUCT_TYPE',
  tax: 1,
  position: 1,
  image: 'https://picsum.photos/100',
  variants: [getGeneratedProductVariant(1), getGeneratedProductVariant(2)],
  allergens: [
    CrudApi.Allergen.egg,
    CrudApi.Allergen.gluten,
    CrudApi.Allergen.milk,
    CrudApi.Allergen.soya,
    CrudApi.Allergen.peanut,
  ],
};

export const generatedProductSeed = {
  base: generatedProductBase,
  getGeneratedProduct,
};
