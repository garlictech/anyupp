import { DateTime } from 'luxon';

import * as CrudApi from '@bgap/crud-gql/api';
import {
  Product,
  ProductComponentMap,
  ProductComponentSetMap,
  ProductVariantWithPrice,
  ProductWithPrices,
} from '@bgap/shared/types';

import { calculatePriceFromAvailabilities } from './calculate-price';
import { Maybe } from '@bgap/crud-gql/api';

export const calculateActualPricesAndCheckActivity = ({
  product,
  atTimeISO,
  inTimeZone,
}: {
  product: Product;
  atTimeISO: string;
  inTimeZone: string;
}): ProductWithPrices | undefined => {
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

  return {
    ...product,
    variants: variantsWithActualPrices,
  };
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
}): ProductVariantWithPrice[] => {
  return variants.reduce((activeVariants, variant) => {
    if (!variant?.isAvailable) {
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

const toGeneratedProductVariantInputType = (
  variant: ProductVariantWithPrice,
): CrudApi.GeneratedProductVariantInput => {
  if (!variant?.pack) {
    throw new Error('HANDLE ME: variant.pack expected to be an object');
  }
  return {
    id: variant.id,
    variantName: variant.variantName,
    position: variant.position,
    pack: { size: variant.pack.size, unit: variant.pack.unit },
    price: variant.price,
  };
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
  productConfigSets?: Maybe<Maybe<CrudApi.ProductConfigSet>[]>;
}): CrudApi.CreateGeneratedProductInput => {
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
  };
};

const toGeneratedProductConfigSetInput = ({
  productConfigSet,
  productComponentSetMap,
  productComponentMap,
}: {
  productConfigSet: Maybe<CrudApi.ProductConfigSet>;
  productComponentSetMap: ProductComponentSetMap;
  productComponentMap: ProductComponentMap;
}): CrudApi.GeneratedProductConfigSetInput | null => {
  if (!productConfigSet) {
    return null;
  }
  const productComponentSet =
    productComponentSetMap[productConfigSet.productSetId];

  if (!productComponentSet) {
    throw new Error(
      `productComponentSet with id ${productConfigSet.productSetId} is missing from the componentSetMap`,
    );
  }

  return {
    position: productConfigSet.position,
    productSetId: productConfigSet.productSetId,
    name: productComponentSet.name,
    type: productComponentSet.type,
    maxSelection: productComponentSet.maxSelection,
    items: productConfigSet.items.map(confComponent => {
      const productComponent =
        productComponentMap[confComponent.productComponentId];
      if (!productComponent) {
        throw new Error(
          `productComponent with id ${confComponent.productComponentId} is missing from the componentMap`,
        );
      }

      const configComponent: CrudApi.GeneratedProductConfigComponentInput = {
        productComponentId: confComponent.productComponentId,
        price: confComponent.price,
        position: confComponent.position,
        // comes from the productComponent itself (referenced by productComponentId)
        name: productComponent.name,
        allergens: productComponent.allergens,
      };
      return configComponent;
    }),
  };
};
