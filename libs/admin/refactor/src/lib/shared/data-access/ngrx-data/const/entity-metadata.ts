import { ENTITY_NAME } from '../../../../shared/types';
import * as CrudApi from '@bgap/crud-gql/api';
import { EntityMetadataMap } from '@ngrx/data';

import { localizedItemFilter, simpleFilter } from './entity-metadata-filters';

const entityMetadata: EntityMetadataMap = {
  [ENTITY_NAME.ADMIN_USER]: {
    filterFn: (
      entities: CrudApi.AdminUser[],
      { name, email }: Partial<CrudApi.AdminUser>,
    ) =>
      entities
        .filter(simpleFilter<CrudApi.AdminUser>('name', true, name))
        .filter(simpleFilter<CrudApi.AdminUser>('email', true, email)),
  },
  [ENTITY_NAME.CHAIN]: {
    filterFn: (
      entities: CrudApi.Chain[],
      { name, description }: Partial<CrudApi.Chain>,
    ) =>
      entities
        .filter(simpleFilter<CrudApi.Chain>('name', true, name))
        .filter(
          localizedItemFilter<CrudApi.Chain>('description', 'hu', description),
        )
        .filter(
          localizedItemFilter<CrudApi.Chain>('description', 'en', description),
        )
        .filter(
          localizedItemFilter<CrudApi.Chain>('description', 'de', description),
        ),
  },
  [ENTITY_NAME.GROUP]: {
    filterFn: (
      entities: CrudApi.Group[],
      { chainId, name, description }: Partial<CrudApi.Group>,
    ) =>
      entities
        .filter(simpleFilter<CrudApi.Group>('chainId', false, chainId))
        .filter(simpleFilter<CrudApi.Group>('name', true, name))
        .filter(
          localizedItemFilter<CrudApi.Group>('description', 'hu', description),
        )
        .filter(
          localizedItemFilter<CrudApi.Group>('description', 'en', description),
        )
        .filter(
          localizedItemFilter<CrudApi.Group>('description', 'de', description),
        ),
  },
  [ENTITY_NAME.UNIT]: {
    filterFn: (
      entities: CrudApi.Unit[],
      { groupId, chainId, name, description }: Partial<CrudApi.Unit>,
    ) =>
      entities
        .filter(simpleFilter<CrudApi.Unit>('chainId', false, chainId))
        .filter(simpleFilter<CrudApi.Unit>('groupId', false, groupId))
        .filter(simpleFilter<CrudApi.Unit>('name', true, name))
        .filter(
          localizedItemFilter<CrudApi.Unit>('description', 'hu', description),
        )
        .filter(
          localizedItemFilter<CrudApi.Unit>('description', 'en', description),
        )
        .filter(
          localizedItemFilter<CrudApi.Unit>('description', 'de', description),
        ),
  },
  [ENTITY_NAME.CHAIN_PRODUCT]: {
    filterFn: (
      entities: CrudApi.ChainProduct[],
      { name, chainId, productCategoryId }: Partial<CrudApi.ChainProduct>,
    ) =>
      entities
        .filter(localizedItemFilter<CrudApi.ChainProduct>('name', 'hu', name))
        .filter(localizedItemFilter<CrudApi.ChainProduct>('name', 'en', name))
        .filter(localizedItemFilter<CrudApi.ChainProduct>('name', 'de', name))
        .filter(simpleFilter<CrudApi.ChainProduct>('chainId', false, chainId))
        .filter(
          simpleFilter<CrudApi.ChainProduct>(
            'productCategoryId',
            false,
            productCategoryId,
          ),
        ),
  },
  [ENTITY_NAME.GROUP_PRODUCT]: {
    filterFn: (
      entities: CrudApi.GroupProduct[],
      { groupId, chainId }: Partial<CrudApi.GroupProduct>,
    ) =>
      entities
        .filter(simpleFilter<CrudApi.GroupProduct>('chainId', false, chainId))
        .filter(simpleFilter<CrudApi.GroupProduct>('groupId', false, groupId)),
  },
  [ENTITY_NAME.UNIT_PRODUCT]: {
    filterFn: (
      entities: CrudApi.UnitProduct[],
      { chainId, groupId, unitId }: Partial<CrudApi.UnitProduct>,
    ) =>
      entities
        .filter(simpleFilter<CrudApi.UnitProduct>('chainId', false, chainId))
        .filter(simpleFilter<CrudApi.UnitProduct>('groupId', false, groupId))
        .filter(simpleFilter<CrudApi.UnitProduct>('unitId', false, unitId)),
  },
  [ENTITY_NAME.GENERATED_PRODUCT]: {
    filterFn: (
      entities: CrudApi.GeneratedProduct[],
      { unitId }: Partial<CrudApi.GeneratedProduct>,
    ) =>
      entities.filter(
        simpleFilter<CrudApi.GeneratedProduct>('unitId', false, unitId),
      ),
  },
  [ENTITY_NAME.PRODUCT_CATEGORY]: {
    filterFn: (
      entities: CrudApi.ProductCategory[],
      { name, chainId }: Partial<CrudApi.ProductCategory>,
    ) =>
      entities
        .filter(
          localizedItemFilter<CrudApi.ProductCategory>('name', 'hu', name),
        )
        .filter(
          localizedItemFilter<CrudApi.ProductCategory>('name', 'en', name),
        )
        .filter(
          localizedItemFilter<CrudApi.ProductCategory>('name', 'de', name),
        )
        .filter(
          simpleFilter<CrudApi.ProductCategory>('chainId', false, chainId),
        ),
  },
  [ENTITY_NAME.PRODUCT_COMPONENT]: {
    filterFn: (
      entities: CrudApi.ProductComponent[],
      { name, chainId }: Partial<CrudApi.ProductComponent>,
    ) =>
      entities
        .filter(
          localizedItemFilter<CrudApi.ProductComponent>('name', 'hu', name),
        )
        .filter(
          localizedItemFilter<CrudApi.ProductComponent>('name', 'en', name),
        )
        .filter(
          localizedItemFilter<CrudApi.ProductComponent>('name', 'de', name),
        )
        .filter(
          simpleFilter<CrudApi.ProductComponent>('chainId', false, chainId),
        ),
  },
  [ENTITY_NAME.PRODUCT_COMPONENT_SET]: {
    filterFn: (
      entities: CrudApi.ProductComponentSet[],
      { name, chainId }: Partial<CrudApi.ProductComponentSet>,
    ) =>
      entities
        .filter(
          localizedItemFilter<CrudApi.ProductComponentSet>('name', 'hu', name),
        )
        .filter(
          localizedItemFilter<CrudApi.ProductComponentSet>('name', 'en', name),
        )
        .filter(
          localizedItemFilter<CrudApi.ProductComponentSet>('name', 'de', name),
        )
        .filter(
          simpleFilter<CrudApi.ProductComponentSet>('chainId', false, chainId),
        ),
  },
  [ENTITY_NAME.ORDER]: {
    filterFn: (entities: CrudApi.Order[], { unitId }: Partial<CrudApi.Order>) =>
      entities.filter(simpleFilter<CrudApi.Order>('unitId', false, unitId)),
  },
  [ENTITY_NAME.ORDER_HISTORY]: {
    filterFn: (entities: CrudApi.Order[], { unitId }: Partial<CrudApi.Order>) =>
      entities.filter(simpleFilter<CrudApi.Order>('unitId', false, unitId)),
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
