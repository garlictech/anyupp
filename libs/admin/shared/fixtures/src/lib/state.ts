import {
  initialAdminUserState,
  ADMIN_USERS_FEATURE_KEY,
} from '@bgap/admin/shared/data-access/admin-users';
import {
  initialAppCoreState,
  APP_CORE_FEATURE_KEY,
} from '@bgap/admin/shared/data-access/app-core';
import {
  initialChainsState,
  CHAINS_FEATURE_KEY,
} from '@bgap/admin/shared/data-access/chains';
import {
  initialDashboardState,
  DASHBOARD_FEATURE_KEY,
} from '@bgap/admin/shared/data-access/dashboard';
import {
  initialGroupsState,
  GROUPS_FEATURE_KEY,
} from '@bgap/admin/shared/data-access/groups';
import {
  initialLoggedUserState,
  LOGGED_USER_FEATURE_KEY,
} from '@bgap/admin/shared/data-access/logged-user';
import {
  initialActiveOrdersState,
  initialHistoryOrdersState,
  ORDERS_FEATURE_KEY,
} from '@bgap/admin/shared/data-access/orders';
import {
  initialUnitsState,
  UNITS_FEATURE_KEY,
} from '@bgap/admin/shared/data-access/units';
import {
  initialFloorMapState,
  FLOOR_MAP_FEATURE_KEY,
} from '@bgap/admin/shared/floor-map';
import {
  initialChainProductState,
  initialGeneratedProductState,
  initialGroupProductState,
  initialUnitProductState,
  PRODUCTS_FEATURE_KEY,
} from '@bgap/admin/shared/data-access/products';
import {
  initialRoleContextState,
  ROLE_CONTEXTS_FEATURE_KEY,
} from '@bgap/admin/shared/data-access/role-contexts';
import {
  initialProductComponentsState,
  PRODUCT_COMPONENTS_FEATURE_KEY,
} from '@bgap/admin/shared/data-access/product-components';
import {
  initialProductComponentSetsState,
  PRODUCT_COMPONENT_SETS_FEATURE_KEY,
} from '@bgap/admin/shared/data-access/product-component-sets';
import {
  initialProductCategoryState,
  PRODUCT_CATEGORIES_FEATURE_KEY,
} from '@bgap/admin/shared/data-access/product-categories';
import {
  initialUsersState,
  USERS_FEATURE_KEY,
} from '@bgap/admin/shared/data-access/users';

export const initialStateFixture = {
  initialState: {
    [APP_CORE_FEATURE_KEY]: initialAppCoreState,
    [LOGGED_USER_FEATURE_KEY]: initialLoggedUserState,
    [ADMIN_USERS_FEATURE_KEY]: initialAdminUserState,
    [DASHBOARD_FEATURE_KEY]: initialDashboardState,
    [FLOOR_MAP_FEATURE_KEY]: initialFloorMapState,
    [CHAINS_FEATURE_KEY]: initialChainsState,
    [GROUPS_FEATURE_KEY]: initialGroupsState,
    [UNITS_FEATURE_KEY]: initialUnitsState,
    [ORDERS_FEATURE_KEY]: {
      active: initialActiveOrdersState,
      history: initialHistoryOrdersState,
    },
    [PRODUCTS_FEATURE_KEY]: {
      chainProducts: initialChainProductState,
      groupProducts: initialGroupProductState,
      unitProducts: initialUnitProductState,
      generatedProducts: initialGeneratedProductState,
    },
    [PRODUCT_CATEGORIES_FEATURE_KEY]: initialProductCategoryState,
    [PRODUCT_COMPONENTS_FEATURE_KEY]: initialProductComponentsState,
    [PRODUCT_COMPONENT_SETS_FEATURE_KEY]: initialProductComponentSetsState,
    [USERS_FEATURE_KEY]: initialUsersState,
    [ROLE_CONTEXTS_FEATURE_KEY]: initialRoleContextState,
  },
};
