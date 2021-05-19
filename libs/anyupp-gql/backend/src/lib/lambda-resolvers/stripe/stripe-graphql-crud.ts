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

  return deps.crudSdk.GetUser(getUserVars, {
    fetchPolicy: 'network-only',
  });
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

  return deps.crudSdk.GetOrder(getOrderVars, {
    fetchPolicy: 'network-only',
  });
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

  return deps.crudSdk.GetUnit(getUnitVars, {
    fetchPolicy: 'network-only',
  });
};

/**
 * Load a signle Transaction from CRUD GraphQL endpoint by it's external transaction ID
 * @param crudGraphqlClient CRUD GraphQL client
 * @param externalTransactionId the external ID of the Transaction to be loaded
 * @returns an instance of ITransaction interface, filled with the loaded transaction's data
 */
export const loadTransactionByExternalTransactionId = async (
  crudGraphqlClient: GraphqlApiClient,
  externalTransactionId: string,
): Promise<ITransaction | null> => {
  // console.log('loadTransactionByExternalTransactionId.external_id=' + externalTransactionId)
  const listTransactionListVars: CrudApi.ListTransactionsQueryVariables = {
    filter: {
      externalTransactionId: { eq: externalTransactionId },
    },
  };
  return executeQuery(crudGraphqlClient)<CrudApi.ListTransactionsQuery>(
    CrudApiQueryDocuments.listTransactions,
    listTransactionListVars,
  )
    .pipe(
      map(data => data.listTransactions?.items as Array<ITransaction>),
      map(data => (data && data.length > 0 ? data[0] : null)),
    )
    .toPromise();
};

/**
 * Create Transaction record in the database with the GraphQL CRUD endpoint
 * @param crudGraphqlClient CRUD GraphQL client
 * @param transaction the Transaction object to be created
 * @returns an instance of ITransaction interface, filled with the created transaction's data
 */
export const createTransaction = async (
  crudGraphqlClient: GraphqlApiClient,
  transaction: CrudApi.CreateTransactionMutationVariables,
): Promise<ITransaction> => {
  return executeMutation(crudGraphqlClient)<CrudApi.CreateTransactionMutation>(
    CrudApiMutationDocuments.createTransaction,
    transaction,
  )
    .pipe(map(data => data.createTransaction as ITransaction))
    .toPromise();
};

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
  return executeMutation(crudGraphqlClient)<CrudApi.UpdateTransactionMutation>(
    CrudApiMutationDocuments.updateTransaction,
    updateTransactionVars,
  )
    .pipe(map(data => data.updateTransaction as ITransaction))
    .toPromise();
};

/**
 * Update Order status in the database with the GraphQL CRUD endpoint
 * @param crudGraphqlClient CRUD GraphQL client
 * @param id the ID of the Order to be updated
 * @param status the new status of the Order
 * @param transactionId the ID of the Transaction belongs to the Order
 * @returns an instance of IOrder interface, filled with the updated transaction's data
 */
export const updateOrderState = async (
  crudGraphqlClient: GraphqlApiClient,
  id: string,
  userId: string,
  status: CrudApi.OrderStatus,
  transactionId: string,
): Promise<IOrder> => {
  console.log(
    '***** updateOrderState().id=' +
      id +
      ', state=' +
      status +
      ', transactionId=' +
      transactionId +
      ', userId=' +
      userId,
  );
  const updateOrderVars: CrudApi.UpdateOrderMutationVariables = {
    input: {
      id: id,
      transactionId: transactionId,
      statusLog: [
        {
          status: status,
          ts: Date.now(),
          userId: userId,
        },
      ],
    },
  };
  return executeMutation(crudGraphqlClient)<CrudApi.UpdateOrderMutation>(
    CrudApiMutationDocuments.updateOrder,
    updateOrderVars,
  )
    .pipe(
      // pipeDebug('***** updateOrderState'),
      map(data => data.updateOrder as IOrder),
      // pipeDebug('***** updateOrderState2'),
    )
    .toPromise();
};
