import { Product } from '@bgap/shared/types';
import { calculatePriceFromAvailabilities } from './calculate-price';
import { DateTime } from 'luxon';
import * as CrudApi from '@bgap/crud-gql/api';

export const calculateActualPricesAndCheckActivity = ({
  product,
  atTimeISO,
  inTimeZone,
}: {
  product: Product;
  atTimeISO: string;
  inTimeZone: string;
}): CrudApi.CreateGeneratedProductInput | undefined => {
  if (!isProductVisibleAndHasAnyAvailableVariant(product)) {
    return undefined;
  }

  if (!product.variants) {
    throw new Error('HANDLE ME: product.variants is undefined');
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

export const isProductVisibleAndHasAnyAvailableVariant = (product: Product) => {
  if (!product.variants) {
    throw new Error('HANDLE ME: product.variants cannot be nullish');
  }

  return product.isVisible && !!isAnyVariantAvailable(product.variants);
};

const isAnyVariantAvailable = (
  variants: CrudApi.Maybe<CrudApi.ProductVariant>[],
) => {
  if (!variants) {
    return false;
  }

  return variants.reduce(
    (prev, product) => (product?.isAvailable ? prev + 1 : prev),
    0,
  );
};

// TODO: extract this logic to be able to calculate prices in the future (for the admin)
const calculateActualPriceForEachVariant = ({
  variants,
  atTimeISO,
  inTimeZone,
}: {
  variants: CrudApi.Maybe<CrudApi.ProductVariant>[];
  atTimeISO: string;
  inTimeZone: string;
}): CrudApi.GeneratedProductVariant[] => {
  return variants.reduce((activeVariants, variant) => {
    if (!variant?.isAvailable) {
      return activeVariants;
    }

    if (!variant.availabilities) {
      throw new Error(
        'HANDLE ME: variant.availabilities expected having value',
      );
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
  }, <CrudApi.GeneratedProductVariant[]>[]);
};

const toGeneratedProductType = (
  product: Product,
  variants: CrudApi.GeneratedProductVariant[],
): CrudApi.CreateGeneratedProductInput => {
  if (
    !(
      product.unitId &&
      product.productCategoryId &&
      product.name &&
      product.productType &&
      product.tax !== undefined &&
      product.position !== undefined
    )
  ) {
    throw new Error("HANDLE ME: undefined's must be handled");
  }

  return {
    id: product.id,
    unitId: product.unitId,
    productCategoryId: product.productCategoryId,
    name: product.name,
    description: product.description,
    image: product.image || '',
    productType: product.productType,
    tax: product.tax,
    position: product.position,
    allergens: product.allergens,
    variants,
  };
};

const toGeneratedProductVariantType = (
  variant: CrudApi.ProductVariant,
  price: number,
): CrudApi.GeneratedProductVariant => {
  if (!variant?.pack) {
    throw new Error('HANDLE ME: variant.pack expected to be an object');
  }

  return {
    id: variant.id,
    variantName: variant.variantName,
    position: variant.position,
    pack: { size: variant.pack.size, unit: variant.pack.unit },
    price,
  };
};
