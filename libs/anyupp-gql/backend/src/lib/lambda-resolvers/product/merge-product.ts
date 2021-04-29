import {
  IProductVariant,
  IChainProduct,
  IGroupProduct,
  IUnitProduct,
  IProduct,
} from '@bgap/shared/types';

export const mergeAllProductLayers = ({
  chainProduct,
  groupProduct,
  unitProduct,
}: {
  chainProduct: IChainProduct;
  groupProduct: IGroupProduct;
  unitProduct: IUnitProduct;
}): IProduct => {
  return {
    ...chainProduct,
    ...groupProduct,
    ...unitProduct,

    isVisible: calculateIsVisible(
      chainProduct?.isVisible,
      groupProduct?.isVisible,
      unitProduct?.isVisible,
    ),
    variants: mergeVariantMaps(groupProduct.variants, unitProduct?.variants),
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
  groupVariants: IProductVariant[] = [],
  unitVariants: IProductVariant[] = [],
): IProductVariant[] => {
  const groupVariantsMap: {
    [key: string]: IProductVariant;
  } = groupVariants.reduce(
    (variants, current) => ({ ...variants, [current.id]: current }),
    {},
  );
  const unitVariantsMap: {
    [key: string]: IProductVariant;
  } = unitVariants.reduce(
    (variants, current) => ({ ...variants, [current.id]: current }),
    {},
  );
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
};

const mergeVariants = ({
  groupVariant,
  unitVariant,
}: {
  groupVariant?: IProductVariant;
  unitVariant?: IProductVariant;
} = {}): IProductVariant => {
  return {
    ...groupVariant,
    ...unitVariant,
    isAvailable: calculateIsAvailable(
      groupVariant?.isAvailable,
      unitVariant?.isAvailable,
    ),
  } as IProductVariant;
};
