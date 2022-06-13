/* eslint-disable @typescript-eslint/no-explicit-any */

import * as R from 'ramda';

import {
  Order,
  OrderItem,
  ServiceFeeType,
  Transaction,
  User,
} from '@bgap/domain';
import { maskDate, simpleFixtures } from '@bgap/shared/fixtures';

import { createInvoice } from './invoice';
import { calculaterServiceFeeItems } from './utils';

test('createInvoice - general case', async () => {
  const szamlazzClient: any = {
    issueInvoice: jest
      .fn()
      .mockReturnValue(Promise.resolve('SZAMLAZZCLIENT ISSUEINVOICE RESULT')),
  };

  const user: User = simpleFixtures.getUser();
  const transaction: Transaction = simpleFixtures.getTransaction();
  const order: Order = simpleFixtures.getOrder();

  expect(
    await createInvoice(szamlazzClient)({ user, transaction, order }),
  ).toMatchSnapshot('the result');

  expect(maskDate(szamlazzClient.issueInvoice.mock.calls)).toMatchSnapshot(
    'issueInvoice calls',
  );
});

test('createInvoice - no service fee', async () => {
  const szamlazzClient: any = {
    issueInvoice: jest
      .fn()
      .mockReturnValue(Promise.resolve('SZAMLAZZCLIENT ISSUEINVOICE RESULT')),
  };

  const user: User = simpleFixtures.getUser();
  const transaction: Transaction = simpleFixtures.getTransaction();
  const order: Order = simpleFixtures.getOrder();
  order.serviceFee = undefined;

  expect(
    await createInvoice(szamlazzClient)({ user, transaction, order }),
  ).toMatchSnapshot('the result');

  expect(maskDate(szamlazzClient.issueInvoice.mock.calls)).toMatchSnapshot(
    'issueInvoice calls',
  );
});

test('createInvoice - no packaging', async () => {
  const szamlazzClient: any = {
    issueInvoice: jest
      .fn()
      .mockReturnValue(Promise.resolve('SZAMLAZZCLIENT ISSUEINVOICE RESULT')),
  };

  const user: User = simpleFixtures.getUser();
  const transaction: Transaction = simpleFixtures.getTransaction();
  const order: Order = simpleFixtures.getOrder();
  order.packagingSum = undefined;

  expect(
    await createInvoice(szamlazzClient)({ user, transaction, order }),
  ).toMatchSnapshot('the result');

  expect(maskDate(szamlazzClient.issueInvoice.mock.calls)).toMatchSnapshot(
    'issueInvoice calls',
  );
});

test('split service fee by tax percentage', async () => {
  const fixture = [
    {
      serviceFee: {
        taxPercentage: 10,
        netPrice: 100,
        currency: 'HUF',
      },
    },
    {
      serviceFee: {
        taxPercentage: 20,
        netPrice: 100,
        currency: 'HUF',
      },
    },
    {
      serviceFee: {
        taxPercentage: 10,
        netPrice: 100,
        currency: 'HUF',
      },
    },
    {},
    {
      serviceFee: {
        taxPercentage: 0,
        netPrice: 100,
        currency: 'HUF',
      },
    },
  ] as OrderItem[];

  expect(
    calculaterServiceFeeItems(
      {
        percentage: 10,
        type: ServiceFeeType.included,
      },
      fixture,
      'HUF',
    ),
  ).toMatchSnapshot();
});

test('createInvoice - service fee included', async () => {
  const szamlazzClient: any = {
    issueInvoice: jest
      .fn()
      .mockReturnValue(Promise.resolve('SZAMLAZZCLIENT ISSUEINVOICE RESULT')),
  };

  const user: User = simpleFixtures.getUser();
  const transaction: Transaction = simpleFixtures.getTransaction();
  const order: Order = R.clone(simpleFixtures.getOrder());
  order.items[0].serviceFee = {
    taxPercentage: 0,
    netPrice: 100,
    currency: 'HUF',
  };

  order.items[1] = R.clone(order.items[0]);

  order.items[1].serviceFee = {
    taxPercentage: 10,
    netPrice: 100,
    currency: 'HUF',
  };

  order.packagingSum = undefined;
  order.serviceFeePolicy = {
    percentage: 10,
    type: ServiceFeeType.included,
  };

  expect(
    await createInvoice(szamlazzClient)({ user, transaction, order }),
  ).toMatchSnapshot('the result');

  expect(maskDate(szamlazzClient.issueInvoice.mock.calls)).toMatchSnapshot(
    'issueInvoice calls',
  );
});
