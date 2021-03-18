import {
  GetAdminUserQuery,
  GetChainProductQuery,
  GetChainQuery,
  GetGroupQuery,
  GetOrderQuery,
  GetProductCategoryQuery,
  GetUnitQuery,
  GetUserQuery,
  ListAdminUsersQuery,
  ListChainProductsQuery,
  ListChainsQuery,
  ListGroupsQuery,
  ListOrdersQuery,
  ListProductCategorysQuery,
  ListUnitsQuery,
  ListUsersQuery,
  OnAdminUserChangeSubscription,
  OnChainsChangeSubscription,
  OnGroupsChangeSubscription,
  OnProductCategoriesChangeSubscription,
  OnUnitsChangeSubscription,
  OnUsersChangeSubscription,
  OnChainProductChangeSubscription
} from '@bgap/admin/amplify-api';

export type queryTypes = GetAdminUserQuery &
  GetChainQuery &
  GetGroupQuery &
  GetUnitQuery &
  GetOrderQuery &
  GetProductCategoryQuery &
  GetChainProductQuery &
  GetUserQuery &
  GetChainProductQuery;
export type listTypes = ListAdminUsersQuery &
  ListChainsQuery &
  ListGroupsQuery &
  ListUnitsQuery &
  ListOrdersQuery &
  ListProductCategorysQuery &
  ListChainProductsQuery &
  ListUsersQuery &
  ListChainProductsQuery;
export type apiQueryTypes = queryTypes & listTypes;
export type subscriptionTypes = OnAdminUserChangeSubscription &
  OnChainsChangeSubscription &
  OnGroupsChangeSubscription &
  OnUnitsChangeSubscription &
  OnUsersChangeSubscription &
  OnProductCategoriesChangeSubscription &
  OnChainProductChangeSubscription;
