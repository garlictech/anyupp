import { of } from 'rxjs';

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  PaymentType,
  PayTipWithStripeInput,
  StartStripePaymentInput,
  TipType,
  User,
} from '@bgap/domain';

import { StripeResolverDeps } from '../stripe.utils';
import { payTipWithStripe } from './pay-tip-with-stripe';
import { startStripePayment } from './start-stripe-payment';

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
            status: OrderStatus.none,
            ts: 123456,
          },
        ],
        paymentMode: {
          method: PaymentMethod.inapp,
          type: PaymentType.stripe,
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
      of<User>({
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
        status: PaymentStatus.waiting_for_payment,
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
  const input: StartStripePaymentInput = {
    invoiceAddress: {
      city: 'Pornóapáti',
      country: 'Neverland',
      customerName: 'Test Elek',
      postalCode: '1234',
      streetAddress: 'Netuddhol',
      taxNumber: '123456',
    },
    orderId: 'ORDER_ID',
    paymentMethod: PaymentMethod.inapp,
    savePaymentMethod: false,
    paymentMethodId: 'PAYMENT_METHOD_ID',
  };

  const deps = getDepsMock();
  const res = await startStripePayment(input)(deps);

  expect(res).toMatchSnapshot('Stripe payment result V2');
  checkMocks(deps);
});

test('payTipWithStripe test - fixed amount', async () => {
  const input: PayTipWithStripeInput = {
    orderId: 'ORDER_ID',
    tip: {
      value: 100,
      type: TipType.amount,
    },
  };

  const deps = getDepsMock();
  const res = await payTipWithStripe(input)(deps);

  expect(res).toMatchSnapshot('Stripe tip payment result');
  checkMocks(deps);
});

test('payTipWithStripe test - percentage', async () => {
  const input: PayTipWithStripeInput = {
    orderId: 'ORDER_ID',
    tip: {
      value: 10,
      type: TipType.percent,
    },
  };

  const deps = getDepsMock();
  const res = await payTipWithStripe(input)(deps);

  expect(res).toMatchSnapshot('Stripe tip payment result');
  checkMocks(deps);
});
