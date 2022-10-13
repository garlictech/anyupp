import { CrudSdkService } from '../../../../shared/data-access/sdk';
import { ApiConf, ENTITY_NAME } from '../../../../shared/types';

export const getApiConf = <T>(
  entityName: ENTITY_NAME,
  crudSdk: CrudSdkService,
) => {
  const confMap = {
    [ENTITY_NAME.UNIT]: {
      // list: crudSdk.sdk.ListUnits,
      listIds: crudSdk.sdk.SearchUnitIds,
      get: crudSdk.sdk.GetUnit,
      add: crudSdk.sdk.CreateUnit,
      update: crudSdk.sdk.UpdateUnit,
    },
    [ENTITY_NAME.UNIT_PRODUCT]: {
      // list: crudSdk.sdk.ListUnitProducts,
      listIds: crudSdk.sdk.SearchUnitProductIds,
      get: crudSdk.sdk.GetUnitProduct,
      add: crudSdk.sdk.CreateUnitProduct,
      update: crudSdk.sdk.UpdateUnitProduct,
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
    [ENTITY_NAME.VARIANT]: {
      // list: crudSdk.sdk.ListVariants,
      listIds: crudSdk.sdk.SearchVariants,
      get: crudSdk.sdk.GetVariant,
      add: crudSdk.sdk.CreateVariant,
      update: crudSdk.sdk.UpdateVariant,
      delete: crudSdk.sdk.DeleteVariant,
    },
  };

  return <ApiConf<T>>confMap[entityName];
};
