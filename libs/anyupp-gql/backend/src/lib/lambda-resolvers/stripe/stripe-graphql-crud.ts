import * as CrudApi from '@bgap/crud-gql/api';
import { StripeResolverDeps } from './stripe.utils';

/**
 * Create an User with the cognito user id and the Stripe customer id
 * @param crudGraphqlClient CRUD GraphQL client
 * @param userId the ID of the user (in the cognito user pool)
 * @param stripeCustomerId the ID of the same user in the Stripe backend
 * @returns an instance of IUser interface, filled with the created user's data
 */
export const createUser = (userId: string, stripeCustomerId: string) => (
  deps: StripeResolverDeps,
) => {
  const createUserVars: CrudApi.CreateUserMutationVariables = {
    input: {
      stripeCustomerId: stripeCustomerId,
      id: userId,
    },
  };

  return deps.crudSdk.CreateUser(createUserVars);
};

/**
 * Update an existing User with the Stripe customer id
 * @param crudGraphqlClient CRUD GraphQL client
 * @param userId the ID of the user (in the cognito user pool)
 * @param stripeCustomerId the ID of the same user in the Stripe backend
 * @returns an instance of IUser interface, filled with the updated user's data
 */
export const updateUser = (userId: string, stripeCustomerId: string) => (
  deps: StripeResolverDeps,
) => {
  const updateUserVars: CrudApi.UpdateUserMutationVariables = {
    input: {
      stripeCustomerId: stripeCustomerId,
      id: userId,
    },
  };

  return deps.crudSdk.UpdateUser(updateUserVars);
};

/**
 * Load a signle User from CRUD GraphQL endpoint by it's ID
 * @param crudGraphqlClient CRUD GraphQL client
 * @param orderId the ID of the User to be loaded
 * @returns an instance of IUser interface, filled with the loaded user's data
 */
export const loadUser = (userId: string) => (deps: StripeResolverDeps) => {
  const getUserVars: CrudApi.GetUserQueryVariables = {
    id: userId,
  };

  return deps.crudSdk.GetUser(getUserVars);
};

/**
 * Load a signle Order from CRUD GraphQL endpoint by it's ID
 * @param crudGraphqlClient CRUD GraphQL client
 * @param orderId the ID of the Order to be loaded
 * @returns an instance of IOrder interface, filled with the loaded order's data
 */
export const loadOrder = (orderId: string) => (deps: StripeResolverDeps) => {
  const getOrderVars: CrudApi.GetOrderQueryVariables = {
    id: orderId,
  };

  return deps.crudSdk.GetOrder(getOrderVars);
};

/**
 * Load a signle Unit from CRUD GraphQL endpoint by it's ID
 * @param crudGraphqlClient CRUD GraphQL client
 * @param unitId the ID of the Unit to be loaded
 * @returns an instance of CrudApi.Unit interface, filled with the loaded unit's data
 */
export const loadUnit = (unitId: string) => (deps: StripeResolverDeps) => {
  const getUnitVars: CrudApi.GetUnitQueryVariables = {
    id: unitId,
  };

  return deps.crudSdk.GetUnit(getUnitVars);
};

/**
 * Load a signle Transaction from CRUD GraphQL endpoint by it's ID
 * @param crudGraphqlClient CRUD GraphQL client
 * @param transactionId the ID of the Transaction to be loaded
 * @returns an instance of ITransaction interface, filled with the loaded transaction's data
 */
export const loadTransaction = (transactionId: string) => (
  deps: StripeResolverDeps,
) => {
  const getUnitVars: CrudApi.GetTransactionQueryVariables = {
    id: transactionId,
  };

  return deps.crudSdk.GetTransaction(getUnitVars);
};

/**
 * Create Transaction record in the database with the GraphQL CRUD endpoint
 * @param crudGraphqlClient CRUD GraphQL client
 * @param transaction the Transaction object to be created
 * @returns an instance of ITransaction interface, filled with the created transaction's data
 */
export const createTransaction = (
  transaction: CrudApi.CreateTransactionMutationVariables,
) => (deps: StripeResolverDeps) => deps.crudSdk.CreateTransaction(transaction);

/**
 * Update Transaction status in the database with the GraphQL CRUD endpoint
 * @param crudGraphqlClient CRUD GraphQL client
 * @param id the ID of the Transaction to be updated
 * @param status the new status of the Transaction
 * @returns an instance of ITransaction interface, filled with the updated transaction's data
 */
export const updateTransactionState = (
  id: string,
  status: CrudApi.PaymentStatus,
) => (deps: StripeResolverDeps) => {
  const updateTransactionVars: CrudApi.UpdateTransactionMutationVariables = {
    input: {
      id,
      status,
    },
  };
  return deps.crudSdk.UpdateTransaction(updateTransactionVars);
};

/**
 * Update Order status in the database with the GraphQL CRUD endpoint
 * @param crudGraphqlClient CRUD GraphQL client
 * @param id the ID of the Order to be updated
 * @param status the new status of the Order
 * @returns an instance of IOrder interface, filled with the updated transaction's data
 */
export const updateOrderState = (
  id: string,
  userId: string,
  status: CrudApi.OrderStatus,
) => (deps: StripeResolverDeps) => {
  const updateOrderVars: CrudApi.UpdateOrderMutationVariables = {
    input: {
      id: id,
      statusLog: [
        {
          status,
          ts: Date.now(),
          userId,
        },
      ],
    },
  };
  return deps.crudSdk.UpdateOrder(updateOrderVars);
};
