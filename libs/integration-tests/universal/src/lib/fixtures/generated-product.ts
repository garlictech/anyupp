import { CrudApi } from '@bgap/crud-gql/api';

const getGeneratedProductVariant = (
  idx: number,
): CrudApi.GeneratedProductVariantInput => ({
  id: `generatedProductVariant_id_${idx}`,
  variantName: { en: `VARIANT_NAME_${idx}` },
  pack: { size: idx, unit: 'UNIT' },
  price: idx,
  position: idx,
});

const generatedProductBase: CrudApi.CreateGeneratedProductInput = {
  id: 'generatedProduct_id_',
  unitId: 'unitId_',
  productCategoryId: 'productCategoryId_',
  name: { en: 'GENERATED_PRODUCT' },
  description: { en: 'DESCRIPTION' },
  productType: 'PRODUCT_TYPE',
  tax: 1,
  position: 1,
  image: 'IMAGE',
  variants: [getGeneratedProductVariant(1), getGeneratedProductVariant(2)],
};

export const generatedProductSeed = {
  base: generatedProductBase,
};
