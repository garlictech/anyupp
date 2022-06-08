import { MergedProduct } from '@bgap/shared/types';
import {
  ChainProduct,
  GroupProduct,
  Maybe,
  ProductVariant,
  UnitProduct,
} from '@bgap/domain';

export const mergeAllProductLayers = ({
  chainProduct,
  groupProduct,
  unitProduct,
}: {
  chainProduct: ChainProduct;
  groupProduct: GroupProduct;
  unitProduct: UnitProduct;
}): MergedProduct => ({
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
});

const calculateIsVisible = (
  visibility1 = true,
  visibility2 = true,
  visibility3 = true,
) => visibility1 && visibility2 && visibility3;

const calculateIsAvailable = (availability1 = true, availability2 = true) =>
  availability1 && availability2;

const mergeVariantMaps = (
  groupVariants: Maybe<ProductVariant>[] | undefined | null,
  unitVariants: Maybe<ProductVariant>[] | undefined | null,
) => {
  if (groupVariants && unitVariants) {
    const groupVariantsMap: {
      [key: string]: ProductVariant;
    } = groupVariants.reduce((variants, current) => {
      if (current?.id) {
        return { ...variants, [current.id]: current };
      } else {
        // TODO handle these cases properly!
        throw new Error('HANDLE ME: Current id cannot be null');
      }
    }, {});

    const unitVariantsMap: {
      [key: string]: ProductVariant;
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
  groupVariant: ProductVariant;
  unitVariant: ProductVariant;
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
