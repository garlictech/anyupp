/* eslint-disable @typescript-eslint/no-explicit-any */
import { startStripePayment } from './start-stripe-payment';
import { payTipWithStripe } from './pay-tip-with-stripe';
import * as CrudApi from '@bgap/crud-gql/api';
import { StripeResolverDeps } from '../stripe.utils';
import { of } from 'rxjs';

const getDepsMock = (): StripeResolverDeps => ({
  userId: 'USER_ID',
  crudSdk: {
    GetOrder: jest.fn().mockReturnValue(
      of({
        id: 'ORDER_ID',
        items: [],
        unitId: 'UNIT_ID',
        userId: 'USER_ID',
        statusLog: [
          {
            userId: 'USER_ID',
            status: CrudApi.OrderStatus.none,
            ts: 123456,
          },
        ],
        paymentMode: {
          method: CrudApi.PaymentMethod.inapp,
          type: CrudApi.PaymentType.stripe,
        },
        sumPriceShown: {
          currency: 'BATKA',
          priceSum: 100,
        },
        transaction: {
          paymentMethodId: 'TRANSACTION PAYMENT METHOD ID',
        },
        serviceFee: {
          currency: 'BATKA',
          grossPrice: 100,
          taxContent: 10,
        },
        packagingSum: {
          currency: 'BATKA',
          netPrice: 10,
          taxPercentage: 20,
        },
      }),
    ),
    GetUser: jest.fn().mockReturnValue(
      of<CrudApi.User>({
        id: 'USER_ID',
        createdAt: 'CREATEDAT',
        updatedAt: 'UPDATEDAT',
      }),
    ),
    UpdateUser: jest
      .fn()
      .mockReturnValue(of({ stripeCustomerId: 'STRIPE_CUSTOMER_ID' })),
    GetUnit: jest.fn().mockReturnValue(of({ id: 'UNIT_ID' })),
    CreateTransaction: jest.fn().mockReturnValue(
      of({
        id: 'TRANSACTION_ID',
        status: CrudApi.PaymentStatus.waiting_for_payment,
      }),
    ),
    UpdateTransaction: jest.fn().mockReturnValue(
      of({
        id: 'TRANSACTION_ID',
      }),
    ),
    UpdateOrder: jest.fn().mockReturnValue(
      of({
        id: 'ORDER_ID',
      }),
    ),
    CreateInvoice: jest.fn().mockReturnValue(
      of({
        id: 'INVOICE_ID',
      }),
    ),
  } as any,
  szamlazzClient: {} as any,
  stripeClient: {
    customers: {
      create: jest.fn().mockReturnValue(
        Promise.resolve({
          id: 'STRIPE_CUSTOMER_ID',
        }),
      ),
    },
    paymentIntents: {
      create: jest.fn().mockReturnValue(
        Promise.resolve({
          id: 'STRIPE PAYMENT INTENT ID',
          client_secret: 'STRIPE CLIENT SECRET',
          status: 'processing',
        }),
      ),
    },
  } as any,
});

const checkMocks = (deps: StripeResolverDeps) => {
  Object.keys(deps.crudSdk).forEach(key =>
    expect((deps.crudSdk as any)[key].mock.calls).toMatchSnapshot(
      `${key} calls`,
    ),
  );

  expect(
    (deps.stripeClient.customers.create as any).mock.calls,
  ).toMatchSnapshot('stripeClient.customers.create.mock');

  expect(
    (deps.stripeClient.paymentIntents.create as any).mock.calls,
  ).toMatchSnapshot('stripeClient.paymentIntents.create.mock');
};

test('startStripePayment test', async () => {
  const input: CrudApi.StartStripePaymentInput = {
    invoiceAddress: {
      city: 'Pornóapáti',
      country: 'Neverland',
      customerName: 'Test Elek',
      postalCode: '1234',
      streetAddress: 'Netuddhol',
      taxNumber: '123456',
    },
    orderId: 'ORDER_ID',
    paymentMethod: CrudApi.PaymentMethod.inapp,
    savePaymentMethod: false,
    paymentMethodId: 'PAYMENT_METHOD_ID',
  };

  const deps = getDepsMock();
  const res = await startStripePayment(input)(deps);

  expect(res).toMatchSnapshot('Stripe payment result');
  checkMocks(deps);
});

test('payTipWithStripe test - fixed amount', async () => {
  const input: CrudApi.PayTipWithStripeInput = {
    orderId: 'ORDER_ID',
    tip: {
      value: 100,
      type: CrudApi.TipType.amount,
    },
  };

  const deps = getDepsMock();
  const res = await payTipWithStripe(input)(deps);

  expect(res).toMatchSnapshot('Stripe tip payment result');
  checkMocks(deps);
});

test('payTipWithStripe test - percentage', async () => {
  const input: CrudApi.PayTipWithStripeInput = {
    orderId: 'ORDER_ID',
    tip: {
      value: 10,
      type: CrudApi.TipType.percent,
    },
  };

  const deps = getDepsMock();
  const res = await payTipWithStripe(input)(deps);

  expect(res).toMatchSnapshot('Stripe tip payment result');
  checkMocks(deps);
});
