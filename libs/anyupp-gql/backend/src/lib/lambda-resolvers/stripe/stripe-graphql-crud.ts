import { executeMutation, executeQuery, GraphqlApiClient } from '@bgap/shared/graphql/api-client';
import { CrudApi, CrudApiMutationDocuments, CrudApiQueryDocuments } from '@bgap/crud-gql/api';
import { map } from 'rxjs/operators';
import { IOrder, ITransaction, IUnit, IUser } from '@bgap/shared/types';

/**
 * Load a signle User from CRUD GraphQL endpoint by it's ID
 * @param crudGraphqlClient CRUD GraphQL client
 * @param orderId the ID of the User to be loaded
 * @returns an instance of IUser interface, filled with the loaded user's data
 */
export const loadUser = async (crudGraphqlClient: GraphqlApiClient, userId: string): Promise<IUser> => {
  const getUserVars: CrudApi.GetUserQueryVariables = {
    id: userId,
  };

  return executeQuery(crudGraphqlClient)<CrudApi.GetUserQuery>(
    CrudApiQueryDocuments.getUser,
    getUserVars,
  ).pipe(
    map(data => data.getUser as IUser),
  ).toPromise();
};

/**
 * Load a signle Order from CRUD GraphQL endpoint by it's ID
 * @param crudGraphqlClient CRUD GraphQL client
 * @param orderId the ID of the Order to be loaded
 * @returns an instance of IOrder interface, filled with the loaded order's data
 */
export const loadOrder = async (crudGraphqlClient: GraphqlApiClient, orderId: string): Promise<IOrder> => {
  const getOrderVars: CrudApi.GetOrderQueryVariables = {
    id: orderId,
  };

  return executeQuery(crudGraphqlClient)<CrudApi.GetOrderQuery>(
    CrudApiQueryDocuments.getOrder,
    getOrderVars,
  ).pipe(
    map(data => data.getOrder as IOrder),
  ).toPromise();
};

/**
 * Load a signle Unit from CRUD GraphQL endpoint by it's ID
 * @param crudGraphqlClient CRUD GraphQL client
 * @param unitId the ID of the Unit to be loaded
 * @returns an instance of IUnit interface, filled with the loaded unit's data
 */
export const loadUnit = async (crudGraphqlClient: GraphqlApiClient, unitId: string): Promise<IUnit> => {
  const getUnitVars: CrudApi.GetUnitQueryVariables = {
    id: unitId,
  };

  return executeQuery(crudGraphqlClient)<CrudApi.GetUnitQuery>(
    CrudApiQueryDocuments.getUnit,
    getUnitVars,
  ).pipe(
    map(data => data.getUnit as IUnit),
  ).toPromise();
};

export const createTransaction = async (crudGraphqlClient: GraphqlApiClient, transaction: CrudApi.CreateUserMutationVariables): Promise<ITransaction> => {
  return executeMutation(crudGraphqlClient)<CrudApi.CreateTransactionMutation>(
    CrudApiMutationDocuments.createTransaction,
    transaction,
  ).pipe(
    map(data => data.createTransaction as unknown as ITransaction),
  ).toPromise();
}
