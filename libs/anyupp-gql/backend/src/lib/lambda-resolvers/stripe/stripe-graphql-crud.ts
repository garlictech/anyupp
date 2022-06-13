import { pipe } from 'fp-ts/lib/function';
import * as R from 'ramda';
import { forkJoin, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import {
  CreateInvoiceMutationVariables,
  CreateTransactionMutationVariables,
  CreateUserMutationVariables,
  GetInvoiceQueryVariables,
  GetOrderQueryVariables,
  GetUnitQueryVariables,
  GetUserQueryVariables,
  InvoiceStatus,
  Order,
  OrderStatus,
  PaymentStatus,
  SearchTransactionsQueryVariables,
  UpdateInvoiceMutationVariables,
  UpdateOrderMutationVariables,
  UpdateTransactionMutationVariables,
  UpdateUserMutationVariables,
} from '@bgap/domain';
import { getAllPaginatedData } from '@bgap/gql-sdk';

import { StripeResolverDeps, StripeResolverDepsUnauth } from './stripe.utils';

export const createUser =
  (stripeCustomerId: string | undefined) => (deps: StripeResolverDeps) => {
    const createUserVars: CreateUserMutationVariables = {
      input: {
        stripeCustomerId: stripeCustomerId,
        id: deps.userId,
      },
    };

    return deps.crudSdk.CreateUser(createUserVars).toPromise();
  };

export const updateUser =
  (stripeCustomerId: string | undefined) => (deps: StripeResolverDeps) => {
    const updateUserVars: UpdateUserMutationVariables = {
      input: {
        stripeCustomerId: stripeCustomerId,
        id: deps.userId,
      },
    };

    return deps.crudSdk.UpdateUser(updateUserVars).toPromise();
  };

export const loadUser = () => (deps: StripeResolverDeps) => {
  const getUserVars: GetUserQueryVariables = {
    id: deps.userId,
  };

  return deps.crudSdk
    .GetUser(getUserVars, {
      fetchPolicy: 'network-only',
    })
    .toPromise();
};

export const loadOrder =
  (orderId: string) => (deps: StripeResolverDepsUnauth) => {
    const getOrderVars: GetOrderQueryVariables = {
      id: orderId,
    };

    return deps.crudSdk
      .GetOrder(getOrderVars, {
        fetchPolicy: 'network-only',
      })
      .toPromise();
  };

export const loadUnit =
  (unitId: string) => (deps: StripeResolverDepsUnauth) => {
    const getUnitVars: GetUnitQueryVariables = {
      id: unitId,
    };

    return deps.crudSdk
      .GetUnit(getUnitVars, {
        fetchPolicy: 'network-only',
      })
      .toPromise();
  };

export const loadTransactionByExternalTransactionId =
  (externalTransactionId: string) => (deps: StripeResolverDepsUnauth) => {
    console.debug(
      'loadTransactionByExternalTransactionId.external_id=' +
        externalTransactionId,
    );
    const searchTransactionsVars: SearchTransactionsQueryVariables = {
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

export const createTransaction =
  (transaction: CreateTransactionMutationVariables) =>
  (deps: StripeResolverDeps) =>
    deps.crudSdk.CreateTransaction(transaction).toPromise();

export const updateTransactionState =
  (id: string, status: PaymentStatus) => (deps: StripeResolverDepsUnauth) => {
    console.debug('updateTransactionState().id=' + id + ', status=' + status);
    const updateTransactionVars: UpdateTransactionMutationVariables = {
      input: {
        id,
        status,
      },
    };

    return deps.crudSdk.UpdateTransaction(updateTransactionVars).toPromise();
  };

export const updateOrderState =
  (
    id: string,
    status?: OrderStatus | undefined,
    transactionId?: string | undefined,
    transactionStatus?: PaymentStatus | undefined,
  ) =>
  async (deps: StripeResolverDeps) => {
    const userId = deps.userId;
    console.debug(
      '***** updateOneOrderState().id=' +
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

    const updateOrderVars: UpdateOrderMutationVariables = {
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
        currentStatus: status,
      },
    };
    return deps.crudSdk.UpdateOrder(updateOrderVars).toPromise();
  };

export const updateOrdersOfATransaction =
  (deps: StripeResolverDeps) =>
  (
    transactionId: string,
    status: OrderStatus | undefined,
    transactionStatus: PaymentStatus | undefined,
  ) =>
    getAllPaginatedData(deps.crudSdk.SearchOrders, {
      query: { filter: { transactionId: { eq: transactionId } } },
    }).pipe(
      switchMap(x =>
        pipe(
          x?.items || [],
          R.reject(x => R.isNil(x)),
          z => z as Order[],
          y => R.defaultTo([] as Order[])(y),
          R.map(order =>
            from(
              updateOrderState(
                order.id,
                status,
                transactionId,
                transactionStatus,
              )(deps),
            ),
          ),
          c => forkJoin(c),
        ),
      ),
    );

export const createInvoice =
  (invoice: CreateInvoiceMutationVariables) => (deps: StripeResolverDeps) =>
    deps.crudSdk.CreateInvoice(invoice).toPromise();

export const updateInvoice =
  (id: string, status: InvoiceStatus, externalInvoiceId: string) =>
  (deps: StripeResolverDeps) => {
    const updateInvoiceVars: UpdateInvoiceMutationVariables = {
      input: {
        id,
        status,
        externalInvoiceId,
      },
    };

    return deps.crudSdk.UpdateInvoice(updateInvoiceVars).toPromise();
  };

export const loadInvoice =
  (invoiceId: string) => async (deps: StripeResolverDeps) => {
    const getInvoiceVars: GetInvoiceQueryVariables = {
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
    status: InvoiceStatus,
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
    const updateInvoiceVars: UpdateInvoiceMutationVariables = {
      input: {
        id: id,
        externalInvoiceId: externalInvoiceId,
        pdfUrl: pdfData,
        status: status,
      },
    };
    return deps.crudSdk.UpdateInvoice(updateInvoiceVars).toPromise();
  };
