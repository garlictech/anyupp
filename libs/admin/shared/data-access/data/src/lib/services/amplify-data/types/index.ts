import * as CrudApi from '@bgap/crud-gql/api';

export type queryTypes = CrudApi.GetAdminUserQuery &
  CrudApi.GetRoleContextQuery &
  CrudApi.GetChainQuery &
  CrudApi.GetGroupQuery &
  CrudApi.GetUnitQuery &
  CrudApi.GetOrderQuery &
  CrudApi.GetProductCategoryQuery &
  CrudApi.GetChainProductQuery &
  // CrudApi.GetUserQuery &
  CrudApi.GetChainProductQuery;
export type listTypes = CrudApi.ListAdminUsersQuery &
  CrudApi.ListRoleContextsQuery &
  CrudApi.ListChainsQuery &
  CrudApi.ListGroupsQuery &
  CrudApi.ListUnitsQuery &
  CrudApi.ListOrdersQuery &
  CrudApi.ListProductCategorysQuery &
  CrudApi.ListChainProductsQuery &
  // CrudApi.ListUsersQuery &
  CrudApi.ListChainProductsQuery;
export type apiQueryTypes = queryTypes & listTypes;
export type subscriptionTypes = CrudApi.OnAdminUserChangeSubscription &
  CrudApi.OnRoleContextsChangeSubscription &
  CrudApi.OnChainsChangeSubscription &
  CrudApi.OnGroupsChangeSubscription &
  CrudApi.OnUnitsChangeSubscription &
  // CrudApi.OnUsersChangeSubscription &
  CrudApi.OnProductCategoriesChangeSubscription &
  CrudApi.OnChainProductChangeSubscription &
  CrudApi.OnAdminRoleContextsChangeSubscription;
