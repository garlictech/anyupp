import * as CrudApi from '@bgap/crud-gql/api';
import { map } from 'rxjs/operators';
import { StripeResolverDeps, StripeResolverDepsUnauth } from './stripe.utils';

/**
 * Create an User with the cognito user id and the Stripe customer id
 * @param crudGraphqlClient CRUD GraphQL client
 * @param userId the ID of the user (in the cognito user pool)
 * @param stripeCustomerId (optional) the ID of the same user in the Stripe backend
 * @returns an instance of User interface, filled with the created user's data
 */
export const createUser =
  (stripeCustomerId: string | undefined) => (deps: StripeResolverDeps) => {
    const createUserVars: CrudApi.CreateUserMutationVariables = {
      input: {
        stripeCustomerId: stripeCustomerId,
        id: deps.userId,
      },
    };

    return deps.crudSdk.CreateUser(createUserVars).toPromise();
  };

/**
 * Update an existing User with the Stripe customer id
 * @param crudGraphqlClient CRUD GraphQL client
 * @param userId the ID of the user (in the cognito user pool)
 * @param stripeCustomerId (optional) the ID of the same user in the Stripe backend
 * @returns an instance of User interface, filled with the updated user's data
 */
export const updateUser =
  (stripeCustomerId: string | undefined) => (deps: StripeResolverDeps) => {
    const updateUserVars: CrudApi.UpdateUserMutationVariables = {
      input: {
        stripeCustomerId: stripeCustomerId,
        id: deps.userId,
      },
    };

    return deps.crudSdk.UpdateUser(updateUserVars).toPromise();
  };

/**
 * Load a signle User from CRUD GraphQL endpoint by it's ID
 * @param crudGraphqlClient CRUD GraphQL client
 * @param orderId the ID of the User to be loaded
 * @returns an instance of User interface, filled with the loaded user's data
 */
export const loadUser = () => (deps: StripeResolverDeps) => {
  const getUserVars: CrudApi.GetUserQueryVariables = {
    id: deps.userId,
  };

  return deps.crudSdk
    .GetUser(getUserVars, {
      fetchPolicy: 'network-only',
    })
    .toPromise();
};

/**
 * Load a signle Order from CRUD GraphQL endpoint by it's ID
 * @param crudGraphqlClient CRUD GraphQL client
 * @param orderId the ID of the Order to be loaded
 * @returns an instance of CrudApi.Order interface, filled with the loaded order's data
 */
export const loadOrder =
  (orderId: string) => (deps: StripeResolverDepsUnauth) => {
    const getOrderVars: CrudApi.GetOrderQueryVariables = {
      id: orderId,
    };

    return deps.crudSdk
      .GetOrder(getOrderVars, {
        fetchPolicy: 'network-only',
      })
      .toPromise();
  };

/**
 * Load a signle Unit from CRUD GraphQL endpoint by it's ID
 * @param crudGraphqlClient CRUD GraphQL client
 * @param unitId the ID of the Unit to be loaded
 * @returns an instance of CrudApi.Unit interface, filled with the loaded unit's data
 */
export const loadUnit =
  (unitId: string) => (deps: StripeResolverDepsUnauth) => {
    const getUnitVars: CrudApi.GetUnitQueryVariables = {
      id: unitId,
    };

    return deps.crudSdk
      .GetUnit(getUnitVars, {
        fetchPolicy: 'network-only',
      })
      .toPromise();
  };

/**
 * Load a signle Transaction from CRUD GraphQL endpoint by it's external transaction ID
 * @param crudGraphqlClient CRUD GraphQL client
 * @param externalTransactionId the external ID of the Transaction to be loaded
 * @returns an instance of ITransaction interface, filled with the loaded transaction's data
 */
export const loadTransactionByExternalTransactionId =
  (externalTransactionId: string) => (deps: StripeResolverDepsUnauth) => {
    console.debug(
      'loadTransactionByExternalTransactionId.external_id=' +
        externalTransactionId,
    );
    const searchTransactionsVars: CrudApi.SearchTransactionsQueryVariables = {
      filter: {
        externalTransactionId: { eq: externalTransactionId },
      },
    };
    return deps.crudSdk
      .SearchTransactions(searchTransactionsVars)
      .pipe(
        map(data => data?.items),
        map(data => (data && data?.length > 0 ? data[0] : null)),
      )
      .toPromise();
  };

/**
 * Create Transaction record in the database with the GraphQL CRUD endpoint
 * @param crudGraphqlClient CRUD GraphQL client
 * @param transaction the Transaction object to be created
 * @returns an instance of ITransaction interface, filled with the created transaction's data
 */
export const createTransaction =
  (transaction: CrudApi.CreateTransactionMutationVariables) =>
  (deps: StripeResolverDeps) =>
    deps.crudSdk.CreateTransaction(transaction).toPromise();

/**
 * Update Transaction status in the database with the GraphQL CRUD endpoint
 * @param crudGraphqlClient CRUD GraphQL client
 * @param id the ID of the Transaction to be updated
 * @param status the new status of the Transaction
 * @returns an instance of ITransaction interface, filled with the updated transaction's data
 */
export const updateTransactionState =
  (id: string, status: CrudApi.PaymentStatus) =>
  (deps: StripeResolverDepsUnauth) => {
    console.debug('updateTransactionState().id=' + id + ', status=' + status);
    const updateTransactionVars: CrudApi.UpdateTransactionMutationVariables = {
      input: {
        id,
        status,
      },
    };

    return deps.crudSdk.UpdateTransaction(updateTransactionVars).toPromise();
  };

/**
 * Update Order status in the database with the GraphQL CRUD endpoint
 * @param crudGraphqlClient CRUD GraphQL client
 * @param id the ID of the Order to be updated
 * @param status the new status of the Order
 * @param transactionId the ID of the Transaction belongs to the Order
 * @returns an instance of CrudApi.Order interface, filled with the updated transaction's data
 */
export const updateOrderState =
  (
    id: string,
    status?: CrudApi.OrderStatus | undefined,
    transactionId?: string | undefined,
    transactionStatus?: CrudApi.PaymentStatus | undefined,
  ) =>
  async (deps: StripeResolverDeps) => {
    const userId = deps.userId;
    console.debug(
      '***** updateOrderState().id=' +
        id +
        ', state=' +
        status +
        ', transactionId=' +
        transactionId +
        ', userId=' +
        userId,
    );
    const order = await loadOrder(id)(deps);
    if (!order) {
      throw Error('Order not found with ID+' + id);
    }

    if (status) {
      order.items.forEach(item => {
        // Update only none item status to placed!!!
        item.statusLog.push({
          status: status,
          ts: new Date().getTime(),
          userId,
        });
      });
    }

    const updateOrderVars: CrudApi.UpdateOrderMutationVariables = {
      input: {
        id: id,
        transactionId: transactionId,
        transactionStatus: transactionStatus,
        items: order.items,
        statusLog: status
          ? [
              {
                status,
                ts: Date.now(),
                userId: userId,
              },
            ]
          : undefined,
      },
    };
    return deps.crudSdk.UpdateOrder(updateOrderVars).toPromise();
  };

/**
 * Create Invoice record in the database with the GraphQL CRUD endpoint
 * @param crudGraphqlClient CRUD GraphQL client
 * @param invoice the Invoice object to be created
 * @returns an instance of Invoice to be created
 */
export const createInvoice =
  (invoice: CrudApi.CreateInvoiceMutationVariables) =>
  (deps: StripeResolverDeps) =>
    deps.crudSdk.CreateInvoice(invoice).toPromise();

/**
 * Update Invoice data in the database with the GraphQL CRUD endpoint
 * @param crudGraphqlClient CRUD GraphQL client
 * @param id the ID of the Invoice to be updated
 * @param status the new status of the Invoice
 * @param externalInvoiceId the ID of the invoice in the szamlazz.hu
 * @returns an instance of Invoice, filled with the updated invoice's data
 */
export const updateInvoice =
  (id: string, status: CrudApi.InvoiceStatus, externalInvoiceId: string) =>
  (deps: StripeResolverDeps) => {
    const updateInvoiceVars: CrudApi.UpdateInvoiceMutationVariables = {
      input: {
        id,
        status,
        externalInvoiceId,
      },
    };

    return deps.crudSdk.UpdateInvoice(updateInvoiceVars).toPromise();
  };

/**
 * Load a signle Invoice from CRUD GraphQL endpoint by it's ID
 * @param crudGraphqlClient CRUD GraphQL client
 * @param invoiceId the ID of the Invoice to be loaded
 * @returns an instance of CrudApi.Invoice interface, filled with the loaded Invoice's data
 */
export const loadInvoice =
  (invoiceId: string) => async (deps: StripeResolverDeps) => {
    const getInvoiceVars: CrudApi.GetInvoiceQueryVariables = {
      id: invoiceId,
    };

    return deps.crudSdk
      .GetInvoice(getInvoiceVars, {
        fetchPolicy: 'network-only',
      })
      .toPromise();
  };

export const updateInvoiceState =
  (
    id: string,
    status: CrudApi.InvoiceStatus,
    externalInvoiceId: string | undefined,
    pdfData: string | undefined,
  ) =>
  (deps: StripeResolverDepsUnauth) => {
    console.debug(
      '***** updateInvoiceState().id=' +
        id +
        ', state=' +
        status +
        ', externalInvoiceId=' +
        externalInvoiceId,
    );
    const updateInvoiceVars: CrudApi.UpdateInvoiceMutationVariables = {
      input: {
        id: id,
        externalInvoiceId: externalInvoiceId,
        pdfUrl: pdfData,
        status: status,
      },
    };
    return deps.crudSdk.UpdateInvoice(updateInvoiceVars).toPromise();
  };
