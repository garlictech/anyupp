import { DateTime } from 'luxon';

import {
  IProduct,
  IProductConfigSet,
  IProductVariant,
  ProductComponentMap,
  ProductComponentSetMap,
  ProductVariantWithPrice,
  ProductWithPrices,
} from '@bgap/shared/types';

import { calculatePriceFromAvailabilities } from './calculate-price';
import { CrudApi } from '@bgap/crud-gql/api';

export const calculateActualPricesAndCheckActivity = ({
  product,
  atTimeISO,
  inTimeZone,
}: {
  product: IProduct;
  atTimeISO: string;
  inTimeZone: string;
}): ProductWithPrices | undefined => {
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

  return {
    ...product,
    variants: variantsWithActualPrices,
  };
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
}): ProductVariantWithPrice[] => {
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

    return [...activeVariants, { ...variant, price: variantPrice }];
  }, <ProductVariantWithPrice[]>[]);
};

export const toCreateGeneratedProductInputType = ({
  product,
  unitId,
  productComponentSetMap,
  productComponentMap,
  productConfigSets,
}: {
  product: ProductWithPrices;
  unitId: string;
  productComponentSetMap: ProductComponentSetMap;
  productComponentMap: ProductComponentMap;
  productConfigSets?: IProductConfigSet[];
}): CrudApi.CreateGeneratedProductInput => ({
  id: product.id,
  unitId,
  productCategoryId: product.productCategoryId,
  name: product.name,
  description: product.description,
  image: product.image || '',
  productType: product.productType,
  tax: product.tax,
  position: product.position,
  allergens: product.allergens,
  configSets: productConfigSets?.map(configSet =>
    toGeneratedProductConfigSetInput({
      productConfigSet: configSet,
      productComponentSetMap,
      productComponentMap,
    }),
  ),
  variants: product.variants.map(toGeneratedProductVariantInputType),
});

const toGeneratedProductVariantInputType = (
  variant: ProductVariantWithPrice,
): CrudApi.GeneratedProductVariantInput => ({
  id: variant.id,
  variantName: variant.variantName,
  position: variant.position,
  pack: { size: variant.pack.size, unit: variant.pack.unit },
  price: variant.price,
});

const toGeneratedProductConfigSetInput = ({
  productConfigSet,
  productComponentSetMap,
  productComponentMap,
}: {
  productConfigSet: IProductConfigSet;
  productComponentSetMap: ProductComponentSetMap;
  productComponentMap: ProductComponentMap;
}): CrudApi.GeneratedProductConfigSetInput => {
  const productComponentSet =
    productComponentSetMap[productConfigSet.productSetId];
  if (!productComponentSet) {
    throw `productComponentSet with id ${productConfigSet.productSetId} is missing from the componentSetMap`;
  }

  return {
    position: productConfigSet.position,
    name: productComponentSet.name,
    description: productComponentSet.description,
    type: productComponentSet.type,
    maxSelection: productComponentSet.maxSelection,
    items: productConfigSet.items.map(confComponent => {
      const productComponent =
        productComponentMap[confComponent.productComponentId];
      if (!productComponent) {
        throw `productComponent with id ${confComponent.productComponentId} is missing from the componentMap`;
      }
      return {
        productComponentId: confComponent.productComponentId,
        price: confComponent.price,
        position: confComponent.position,
        // comes from the productComponent itself (referenced by productComponentId)
        name: productComponent.name,
        description: productComponent.description,
        allergens: productComponent.allergens,
      };
    }),
  };
};
