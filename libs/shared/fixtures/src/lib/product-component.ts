import { RequiredId } from '@bgap/shared/types';
import {
  Allergen,
  CreateProductComponentInput,
  CreateProductComponentSetInput,
  ProductComponentSetType,
} from '@bgap/domain';
import { testIdPrefix } from './common';

const productComponentBase: RequiredId<CreateProductComponentInput> = {
  id: `${testIdPrefix}product_component_id_`,
  ownerEntity: 'unitId_',
  name: {
    en: 'PRODUCT_COMPONENT',
    de: 'PRODUCT_COMPONENT',
    hu: 'TERMEK_KOMPONENS',
  },
  description: 'DESCRIPTION',
  allergens: [
    Allergen.egg,
    Allergen.gluten,
    Allergen.milk,
    Allergen.soya,
    Allergen.peanut,
  ],
};

export const getProductComponent = ({
  id,
  ownerEntity,
}: {
  id: string;
  ownerEntity: string;
}): RequiredId<CreateProductComponentInput> => ({
  ...productComponentBase,
  id,
  name: {
    en: `Small stuff`,
    de: `Huccen puccen`,
    hu: `Kis bizbasz`,
  },
  description: `Valami kis kamu termék komponens`,
  ownerEntity,
});

const productComponentSetBase: Omit<
  RequiredId<CreateProductComponentSetInput>,
  'ownerEntity'
> = {
  id: `${testIdPrefix}product_component_set_id_`,
  name: { en: 'Small stuffs', de: 'huccen puccen', hu: 'Extra bizbaszok' },
  description: 'Kamu extra bizbaszok',
  type: ProductComponentSetType.extras,
  items: [],
  maxSelection: 0,
};

export const getComponentSet = ({
  id,
  unitId,
  itemIds = [],
}: {
  id: string;
  unitId: string;
  itemIds: string[];
}): RequiredId<CreateProductComponentSetInput> => ({
  ...productComponentSetBase,
  id,
  items: itemIds,
  maxSelection: itemIds.length,
  ownerEntity: unitId,
  name: {
    en: `Small components`,
    de: `huccen puccen`,
    hu: `Kamu kis komponensek`,
  },
  description: `Komponensek for good`,
});

export const productComponentSetFixture = {
  productComponentBase,
  productComponentSetBase,
};
