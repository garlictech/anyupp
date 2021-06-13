import * as CrudApi from '@bgap/crud-gql/api';
import { Product } from '@bgap/shared/types';

export type MergedProduct = Product & {
  unitId: string;
  groupId: string;
  chainId: string;
};

export const mergeAllProductLayers = ({
  chainProduct,
  groupProduct,
  unitProduct,
}: {
  chainProduct: CrudApi.ChainProduct;
  groupProduct: CrudApi.GroupProduct;
  unitProduct: CrudApi.UnitProduct;
}): MergedProduct => {
  return {
    ...chainProduct,
    ...groupProduct,
    ...unitProduct,

    isVisible: calculateIsVisible(
      chainProduct?.isVisible,
      groupProduct?.isVisible,
      unitProduct?.isVisible,
    ),
    variants:
      mergeVariantMaps(groupProduct?.variants, unitProduct?.variants) ?? [],
  };
};

const calculateIsVisible = (
  visibility1 = true,
  visibility2 = true,
  visibility3 = true,
) => visibility1 && visibility2 && visibility3;

const calculateIsAvailable = (availability1 = true, availability2 = true) =>
  availability1 && availability2;

const mergeVariantMaps = (
  groupVariants: CrudApi.Maybe<CrudApi.ProductVariant>[] | undefined | null,
  unitVariants: CrudApi.Maybe<CrudApi.ProductVariant>[] | undefined | null,
) => {
  if (groupVariants && unitVariants) {
    const groupVariantsMap: {
      [key: string]: CrudApi.ProductVariant;
    } = groupVariants.reduce((variants, current) => {
      if (current?.id) {
        return { ...variants, [current.id]: current };
      } else {
        // TODO handle these cases properly!
        throw new Error('HANDLE ME: Current id cannot be null');
      }
    }, {});

    const unitVariantsMap: {
      [key: string]: CrudApi.ProductVariant;
    } = unitVariants.reduce((variants, current) => {
      if (current?.id) {
        return { ...variants, [current.id]: current };
      } else {
        throw new Error('HANDLE ME: Current id cannot be null');
      }
    }, {});

    const ids = [
      ...new Set([
        ...Object.keys(groupVariantsMap),
        ...Object.keys(unitVariantsMap),
      ]),
    ];
    return ids.map(id =>
      mergeVariants({
        groupVariant: groupVariantsMap[id],
        unitVariant: unitVariantsMap[id],
      }),
    );
  } else {
    throw new Error('HANDLE ME: One of the prameters are undefined or null');
  }
};

const mergeVariants = ({
  groupVariant,
  unitVariant,
}: {
  groupVariant: CrudApi.ProductVariant;
  unitVariant: CrudApi.ProductVariant;
}) => {
  return {
    ...groupVariant,
    ...unitVariant,
    isAvailable: calculateIsAvailable(
      groupVariant?.isAvailable,
      unitVariant?.isAvailable,
    ),
  };
};
