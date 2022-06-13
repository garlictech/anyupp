import {
  AdminUser,
  Chain,
  ChainProduct,
  GeneratedProduct,
  Group,
  GroupProduct,
  Order,
  ProductCategory,
  ProductComponent,
  ProductComponentSet,
  Unit,
  UnitProduct,
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
  [ENTITY_NAME.CHAIN]: {
    filterFn: (entities: Chain[], { name, description }: Partial<Chain>) =>
      entities
        .filter(simpleFilter<Chain>('name', true, name))
        .filter(localizedItemFilter<Chain>('description', 'hu', description))
        .filter(localizedItemFilter<Chain>('description', 'en', description))
        .filter(localizedItemFilter<Chain>('description', 'de', description)),
  },
  [ENTITY_NAME.GROUP]: {
    filterFn: (
      entities: Group[],
      { chainId, name, description }: Partial<Group>,
    ) =>
      entities
        .filter(simpleFilter<Group>('chainId', false, chainId))
        .filter(simpleFilter<Group>('name', true, name))
        .filter(localizedItemFilter<Group>('description', 'hu', description))
        .filter(localizedItemFilter<Group>('description', 'en', description))
        .filter(localizedItemFilter<Group>('description', 'de', description)),
  },
  [ENTITY_NAME.UNIT]: {
    filterFn: (
      entities: Unit[],
      { groupId, chainId, name, description }: Partial<Unit>,
    ) =>
      entities
        .filter(simpleFilter<Unit>('chainId', false, chainId))
        .filter(simpleFilter<Unit>('groupId', false, groupId))
        .filter(simpleFilter<Unit>('name', true, name))
        .filter(localizedItemFilter<Unit>('description', 'hu', description))
        .filter(localizedItemFilter<Unit>('description', 'en', description))
        .filter(localizedItemFilter<Unit>('description', 'de', description)),
  },
  [ENTITY_NAME.CHAIN_PRODUCT]: {
    filterFn: (
      entities: ChainProduct[],
      { name, chainId, productCategoryId }: Partial<ChainProduct>,
    ) =>
      entities
        .filter(localizedItemFilter<ChainProduct>('name', 'hu', name))
        .filter(localizedItemFilter<ChainProduct>('name', 'en', name))
        .filter(localizedItemFilter<ChainProduct>('name', 'de', name))
        .filter(simpleFilter<ChainProduct>('chainId', false, chainId))
        .filter(
          simpleFilter<ChainProduct>(
            'productCategoryId',
            false,
            productCategoryId,
          ),
        ),
  },
  [ENTITY_NAME.GROUP_PRODUCT]: {
    filterFn: (
      entities: GroupProduct[],
      { groupId, chainId }: Partial<GroupProduct>,
    ) =>
      entities
        .filter(simpleFilter<GroupProduct>('chainId', false, chainId))
        .filter(simpleFilter<GroupProduct>('groupId', false, groupId)),
  },
  [ENTITY_NAME.UNIT_PRODUCT]: {
    filterFn: (
      entities: UnitProduct[],
      { chainId, groupId, unitId }: Partial<UnitProduct>,
    ) =>
      entities
        .filter(simpleFilter<UnitProduct>('chainId', false, chainId))
        .filter(simpleFilter<UnitProduct>('groupId', false, groupId))
        .filter(simpleFilter<UnitProduct>('unitId', false, unitId)),
  },
  [ENTITY_NAME.GENERATED_PRODUCT]: {
    filterFn: (
      entities: GeneratedProduct[],
      { unitId }: Partial<GeneratedProduct>,
    ) =>
      entities.filter(simpleFilter<GeneratedProduct>('unitId', false, unitId)),
  },
  [ENTITY_NAME.PRODUCT_CATEGORY]: {
    filterFn: (
      entities: ProductCategory[],
      { name, chainId }: Partial<ProductCategory>,
    ) =>
      entities
        .filter(localizedItemFilter<ProductCategory>('name', 'hu', name))
        .filter(localizedItemFilter<ProductCategory>('name', 'en', name))
        .filter(localizedItemFilter<ProductCategory>('name', 'de', name))
        .filter(simpleFilter<ProductCategory>('chainId', false, chainId)),
  },
  [ENTITY_NAME.PRODUCT_COMPONENT]: {
    filterFn: (
      entities: ProductComponent[],
      { name, chainId }: Partial<ProductComponent>,
    ) =>
      entities
        .filter(localizedItemFilter<ProductComponent>('name', 'hu', name))
        .filter(localizedItemFilter<ProductComponent>('name', 'en', name))
        .filter(localizedItemFilter<ProductComponent>('name', 'de', name))
        .filter(simpleFilter<ProductComponent>('chainId', false, chainId)),
  },
  [ENTITY_NAME.PRODUCT_COMPONENT_SET]: {
    filterFn: (
      entities: ProductComponentSet[],
      { name, chainId }: Partial<ProductComponentSet>,
    ) =>
      entities
        .filter(localizedItemFilter<ProductComponentSet>('name', 'hu', name))
        .filter(localizedItemFilter<ProductComponentSet>('name', 'en', name))
        .filter(localizedItemFilter<ProductComponentSet>('name', 'de', name))
        .filter(simpleFilter<ProductComponentSet>('chainId', false, chainId)),
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
