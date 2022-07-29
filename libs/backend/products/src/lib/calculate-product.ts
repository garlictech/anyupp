import { Maybe } from '@bgap/crud-gql/api';
import {
  defaultSupportedServingModes,
  MergedProductWithPrices,
  ProductComponentMap,
  ProductComponentSetMap,
  ProductVariantWithPrice,
} from '@bgap/shared/types';
import {
  CreateUnitProductInput,
  ProductConfigComponentInput,
  ProductConfigSet,
  ProductConfigSetInput,
  ProductVariant,
  ProductVariantInput,
  UnitProduct,
} from '@bgap/domain';
import { DateTime } from 'luxon';
import { calculatePriceFromAvailabilities } from './calculate-price';

export const calculateActualPricesAndCheckActivity = ({
  product,
  atTimeISO,
  inTimeZone,
}: {
  product: UnitProduct;
  atTimeISO: string;
  inTimeZone: string;
}): MergedProductWithPrices | undefined => {
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

export const isProductVisibleAndHasAnyAvailableVariant = (
  product: UnitProduct,
) => {
  if (!product.variants) {
    throw new Error('HANDLE ME: product.variants cannot be nullish');
  }

  return product.isVisible && !!isAnyVariantAvailable(product.variants);
};

const isAnyVariantAvailable = (variants: Maybe<ProductVariant>[]) => {
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
  variants: Maybe<ProductVariant>[];
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

const toProductVariantInputType = (
  variant: ProductVariantWithPrice,
): ProductVariantInput => {
  if (!variant?.pack) {
    throw new Error('HANDLE ME: variant.pack expected to be an object');
  }

  return {
    id: variant.id,
    variantName: variant.variantName,
    position: variant.position,
    pack: variant.pack,
    price: variant.price,
    netPackagingFee: variant.netPackagingFee,
    soldOut: variant.soldOut,
    isAvailable: variant.isAvailable,
  };
};

export const toCreateProductInputType = ({
  product,
  unitId,
  productComponentSetMap,
  productComponentMap,
  productConfigSets,
}: {
  product: MergedProductWithPrices;
  unitId: string;
  productComponentSetMap: ProductComponentSetMap;
  productComponentMap: ProductComponentMap;
  productConfigSets?: Maybe<Maybe<ProductConfigSet>[]>;
}): CreateUnitProductInput => {
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
      toProductConfigSetInput({
        productConfigSet: configSet,
        productComponentSetMap,
        productComponentMap,
      }),
    ),
    variants: product.variants.map(toProductVariantInputType),
    supportedServingModes:
      product.supportedServingModes && product.supportedServingModes.length > 0
        ? product.supportedServingModes
        : defaultSupportedServingModes,
    takeawayTax: product.takeawayTax || product.tax,
    isVisible: product.isVisible,
  };
};

const toProductConfigSetInput = ({
  productConfigSet,
  productComponentSetMap,
  productComponentMap,
}: {
  productConfigSet: Maybe<ProductConfigSet>;
  productComponentSetMap: ProductComponentSetMap;
  productComponentMap: ProductComponentMap;
}): ProductConfigSetInput | null => {
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
    supportedServingModes:
      productComponentSet.supportedServingModes &&
      productComponentSet.supportedServingModes.length > 0
        ? productComponentSet.supportedServingModes
        : defaultSupportedServingModes,
    items: productConfigSet.items.map(confComponent => {
      const productComponent =
        productComponentMap[confComponent.productComponentId];
      if (!productComponent) {
        throw new Error(
          `productComponent with id ${confComponent.productComponentId} is missing from the componentMap`,
        );
      }

      const configComponent: ProductConfigComponentInput = {
        productComponentId: confComponent.productComponentId,
        price: confComponent.price,
        position: confComponent.position,
        // comes from the productComponent itself (referenced by productComponentId)
        name: productComponent.name,
        allergens: productComponent.allergens,
        netPackagingFee: confComponent.netPackagingFee,
        soldOut: productComponent.soldOut,
        externalId: productComponent.externalId,
      };
      return configComponent;
    }),
  };
};
