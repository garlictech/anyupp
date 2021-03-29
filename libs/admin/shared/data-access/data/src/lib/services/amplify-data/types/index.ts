import { AmplifyApi } from '@bgap/admin/amplify-api';

export type queryTypes = AmplifyApi.GetAdminUserQuery &
  AmplifyApi.GetChainQuery &
  AmplifyApi.GetGroupQuery &
  AmplifyApi.GetUnitQuery &
  AmplifyApi.GetOrderQuery &
  AmplifyApi.GetProductCategoryQuery &
  AmplifyApi.GetChainProductQuery &
  AmplifyApi.GetUserQuery &
  AmplifyApi.GetChainProductQuery;
export type listTypes = AmplifyApi.ListAdminUsersQuery &
  AmplifyApi.ListChainsQuery &
  AmplifyApi.ListGroupsQuery &
  AmplifyApi.ListUnitsQuery &
  AmplifyApi.ListOrdersQuery &
  AmplifyApi.ListProductCategorysQuery &
  AmplifyApi.ListChainProductsQuery &
  AmplifyApi.ListUsersQuery &
  AmplifyApi.ListChainProductsQuery;
export type apiQueryTypes = queryTypes & listTypes;
export type subscriptionTypes = AmplifyApi.OnAdminUserChangeSubscription &
  AmplifyApi.OnChainsChangeSubscription &
  AmplifyApi.OnGroupsChangeSubscription &
  AmplifyApi.OnUnitsChangeSubscription &
  AmplifyApi.OnUsersChangeSubscription &
  AmplifyApi.OnProductCategoriesChangeSubscription &
  AmplifyApi.OnChainProductChangeSubscription;
