import { CrudSdkService } from '../../../../shared/data-access/sdk';
import { ApiConf, ENTITY_NAME } from '../../../../shared/types';

export const getApiConf = <T>(
  entityName: ENTITY_NAME,
  crudSdk: CrudSdkService,
) => {
  const confMap = {
    [ENTITY_NAME.CHAIN]: {
      // list: crudSdk.sdk.ListChains,
      listIds: crudSdk.sdk.SearchChainIds,
      get: crudSdk.sdk.GetChain,
      add: crudSdk.sdk.CreateChain,
      update: crudSdk.sdk.UpdateChain,
    },
    [ENTITY_NAME.GROUP]: {
      // list: crudSdk.sdk.ListGroups,
      listIds: crudSdk.sdk.SearchGroupIds,
      get: crudSdk.sdk.GetGroup,
      add: crudSdk.sdk.CreateGroup,
      update: crudSdk.sdk.UpdateGroup,
    },
    [ENTITY_NAME.UNIT]: {
      // list: crudSdk.sdk.ListUnits,
      listIds: crudSdk.sdk.SearchUnitIds,
      get: crudSdk.sdk.GetUnit,
      add: crudSdk.sdk.CreateUnit,
      update: crudSdk.sdk.UpdateUnit,
    },
    [ENTITY_NAME.CHAIN_PRODUCT]: {
      // list: crudSdk.sdk.ListChainProducts,
      listIds: crudSdk.sdk.SearchChainProductIds,
      get: crudSdk.sdk.GetChainProduct,
      add: crudSdk.sdk.CreateChainProduct,
      update: crudSdk.sdk.UpdateChainProduct,
    },
    [ENTITY_NAME.GROUP_PRODUCT]: {
      // list: crudSdk.sdk.ListGroupProducts,
      listIds: crudSdk.sdk.SearchGroupProductIds,
      get: crudSdk.sdk.GetGroupProduct,
      add: crudSdk.sdk.CreateGroupProduct,
      update: crudSdk.sdk.UpdateGroupProduct,
    },
    [ENTITY_NAME.UNIT_PRODUCT]: {
      // list: crudSdk.sdk.ListUnitProducts,
      listIds: crudSdk.sdk.SearchUnitProductIds,
      get: crudSdk.sdk.GetUnitProduct,
      add: crudSdk.sdk.CreateUnitProduct,
      update: crudSdk.sdk.UpdateUnitProduct,
    },
    [ENTITY_NAME.GENERATED_PRODUCT]: {
      // list: crudSdk.sdk.ListGeneratedProducts,
      listIds: crudSdk.sdk.SearchGeneratedProductIds,
      get: crudSdk.sdk.GetGeneratedProduct,
      add: crudSdk.sdk.CreateGeneratedProduct,
      update: crudSdk.sdk.UpdateGeneratedProduct,
    },
    [ENTITY_NAME.PRODUCT_CATEGORY]: {
      // list: crudSdk.sdk.ListProductCategories,
      listIds: crudSdk.sdk.SearchProductCategoryIds,
      get: crudSdk.sdk.GetProductCategory,
      add: crudSdk.sdk.CreateProductCategory,
      update: crudSdk.sdk.UpdateProductCategory,
    },
    [ENTITY_NAME.PRODUCT_COMPONENT]: {
      // list: crudSdk.sdk.ListProductComponents,
      listIds: crudSdk.sdk.SearchProductComponentIds,
      get: crudSdk.sdk.GetProductComponent,
      add: crudSdk.sdk.CreateProductComponent,
      update: crudSdk.sdk.UpdateProductComponent,
    },
    [ENTITY_NAME.PRODUCT_COMPONENT_SET]: {
      // list: crudSdk.sdk.ListProductComponentSets,
      listIds: crudSdk.sdk.SearchProductComponentSetIds,
      get: crudSdk.sdk.GetProductComponentSet,
      add: crudSdk.sdk.CreateProductComponentSet,
      update: crudSdk.sdk.UpdateProductComponentSet,
    },
    [ENTITY_NAME.ADMIN_USER]: {
      // list: crudSdk.sdk.ListAdminUsers,
      listIds: crudSdk.sdk.SearchAdminUserIds,
      get: crudSdk.sdk.GetAdminUser,
      add: crudSdk.sdk.CreateAdminUser,
      update: crudSdk.sdk.UpdateAdminUser,
    },
    [ENTITY_NAME.ORDER]: {
      list: crudSdk.sdk.ListOrders,
      listIds: crudSdk.sdk.SearchOrderIds,
      get: crudSdk.sdk.GetOrder,
      add: crudSdk.sdk.CreateOrder,
      update: crudSdk.sdk.UpdateOrder,
    },
    [ENTITY_NAME.ORDER_HISTORY]: {
      list: crudSdk.sdk.ListOrders,
      listIds: crudSdk.sdk.SearchOrderIds,
      get: crudSdk.sdk.GetOrder,
      add: crudSdk.sdk.CreateOrder,
      update: crudSdk.sdk.UpdateOrder,
    },
  };

  return <ApiConf<T>>confMap[entityName];
};
