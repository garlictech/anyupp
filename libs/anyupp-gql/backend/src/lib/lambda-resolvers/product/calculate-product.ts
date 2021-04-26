import {
  IGeneratedProduct,
  IGeneratedProductVariant,
  IProduct,
  IProductVariant,
} from '@bgap/shared/types';
import { calculatePriceFromAvailabilities } from './calculate-price';
import { DateTime } from 'luxon';

export const calculateActualPricesAndCheckActivity = ({
  product,
  atTimeISO,
  inTimeZone,
}: {
  product: IProduct;
  atTimeISO: string;
  inTimeZone: string;
}): IGeneratedProduct | undefined => {
  if (!isProductVisibleAndHasAnyAvailableVariant(product)) {
    return undefined;
  }

  const variantsWithActualPrices = calculateActualPriceForEachVariant({
    variants: product.variants,
    atTimeISO,
    inTimeZone,
  });

  if (Object.keys(variantsWithActualPrices).length === 0) {
    return undefined;
  }

  return toGeneratedProductType(product, variantsWithActualPrices);
};

export const isProductVisibleAndHasAnyAvailableVariant = (product: IProduct) =>
  product.isVisible && !!isAnyVariantAvailable(product.variants);

const isAnyVariantAvailable = (variants: IProductVariant[]) => {
  if (!variants) {
    return false;
  }

  return variants.reduce(
    (prev, product) => (product.isAvailable ? prev + 1 : prev),
    0,
  );
};

// TODO: extract this logic to be able to calculate prices in the future (for the admin)
const calculateActualPriceForEachVariant = ({
  variants,
  atTimeISO,
  inTimeZone,
}: {
  variants: IProductVariant[];
  atTimeISO: string;
  inTimeZone: string;
}): IGeneratedProductVariant[] => {
  return variants.reduce((activeVariants, variant) => {
    if (!variant.isAvailable) {
      return activeVariants;
    }
    const variantPrice: number | undefined = calculatePriceFromAvailabilities(
      variant.availabilities,
      DateTime.fromISO(atTimeISO).setZone(inTimeZone),
    );
    if (variantPrice === undefined) {
      return activeVariants;
    }

    return [
      ...activeVariants,
      toGeneratedProductVariantType(variant, variantPrice),
    ];
  }, <IGeneratedProductVariant[]>[]);
};

const toGeneratedProductType = (
  product: IProduct,
  variants: IGeneratedProductVariant[],
): IGeneratedProduct => ({
  id: product.id,
  productCategoryId: product.productCategoryId,
  name: product.name,
  description: product.description,
  image: product.image || '',
  productType: product.productType,
  tax: product.tax,
  position: product.position,
  variants,
});

const toGeneratedProductVariantType = (
  variant: IProductVariant,
  price: number,
): IGeneratedProductVariant => ({
  id: variant.id,
  variantName: variant.variantName,
  position: variant.position,
  pack: { size: variant.pack.size, unit: variant.pack.unit },
  price,
});
