import {
  AdminUser,
  Order,
  ProductCategory,
  ProductComponent,
  ProductComponentSet,
  Unit,
  UnitProduct,
  Variant,
} from '@bgap/domain';
import { EntityMetadataMap } from '@ngrx/data';

import { ENTITY_NAME } from '../../../../shared/types';
import { localizedItemFilter, simpleFilter } from './entity-metadata-filters';

const entityMetadata: EntityMetadataMap = {
  [ENTITY_NAME.ADMIN_USER]: {
    filterFn: (entities: AdminUser[], { name, email }: Partial<AdminUser>) =>
      entities
        .filter(simpleFilter<AdminUser>('name', true, name))
        .filter(simpleFilter<AdminUser>('email', true, email)),
  },
  [ENTITY_NAME.UNIT]: {
    filterFn: (entities: Unit[], { name, description }: Partial<Unit>) =>
      entities
        .filter(simpleFilter<Unit>('name', true, name))
        .filter(localizedItemFilter<Unit>('description', 'hu', description))
        .filter(localizedItemFilter<Unit>('description', 'en', description))
        .filter(localizedItemFilter<Unit>('description', 'de', description)),
  },
  [ENTITY_NAME.UNIT_PRODUCT]: {
    filterFn: (entities: UnitProduct[], { unitId }: Partial<UnitProduct>) =>
      entities.filter(simpleFilter<UnitProduct>('unitId', false, unitId)),
  },
  [ENTITY_NAME.VARIANT]: {
    filterFn: (
      entities: Variant[],
      { unitProductVariantsId }: Partial<Variant>,
    ) =>
      entities.filter(
        simpleFilter<Variant>(
          'unitProductVariantsId',
          false,

          unitProductVariantsId,
        ),
      ),
  },
  [ENTITY_NAME.PRODUCT_CATEGORY]: {
    filterFn: (
      entities: ProductCategory[],
      { name, ownerEntity }: Partial<ProductCategory>,
    ) =>
      entities
        .filter(localizedItemFilter<ProductCategory>('name', 'hu', name))
        .filter(localizedItemFilter<ProductCategory>('name', 'en', name))
        .filter(localizedItemFilter<ProductCategory>('name', 'de', name))
        .filter(
          simpleFilter<ProductCategory>('ownerEntity', false, ownerEntity),
        ),
  },
  [ENTITY_NAME.PRODUCT_COMPONENT]: {
    filterFn: (
      entities: ProductComponent[],
      { name, ownerEntity }: Partial<ProductComponent>,
    ) =>
      entities
        .filter(localizedItemFilter<ProductComponent>('name', 'hu', name))
        .filter(localizedItemFilter<ProductComponent>('name', 'en', name))
        .filter(localizedItemFilter<ProductComponent>('name', 'de', name))
        .filter(
          simpleFilter<ProductComponent>('ownerEntity', false, ownerEntity),
        ),
  },
  [ENTITY_NAME.PRODUCT_COMPONENT_SET]: {
    filterFn: (
      entities: ProductComponentSet[],
      { name, ownerEntity }: Partial<ProductComponentSet>,
    ) =>
      entities
        .filter(localizedItemFilter<ProductComponentSet>('name', 'hu', name))
        .filter(localizedItemFilter<ProductComponentSet>('name', 'en', name))
        .filter(localizedItemFilter<ProductComponentSet>('name', 'de', name))
        .filter(
          simpleFilter<ProductComponentSet>('ownerEntity', false, ownerEntity),
        ),
  },
  [ENTITY_NAME.ORDER]: {
    filterFn: (entities: Order[], { unitId }: Partial<Order>) =>
      entities.filter(simpleFilter<Order>('unitId', false, unitId)),
  },
  [ENTITY_NAME.ORDER_HISTORY]: {
    filterFn: (entities: Order[], { unitId }: Partial<Order>) =>
      entities.filter(simpleFilter<Order>('unitId', false, unitId)),
  },
};

const pluralNames = {
  [ENTITY_NAME.PRODUCT_CATEGORY]: 'ProductCategories',
  [ENTITY_NAME.ORDER_HISTORY]: 'OrderHistory',
};

export const entityConfig = {
  entityMetadata,
  pluralNames,
};
