/* eslint-disable @typescript-eslint/no-explicit-any */
import * as CrudApi from '@bgap/crud-gql/api';
import { calculaterServiceFeeItems, createInvoice } from './invoice';
import { simpleFixtures, maskDate } from '@bgap/shared/fixtures';
import * as R from 'ramda';

test('createInvoice - general case', async () => {
  const szamlazzClient: any = {
    issueInvoice: jest
      .fn()
      .mockReturnValue(Promise.resolve('SZAMLAZZCLIENT ISSUEINVOICE RESULT')),
  };

  const user: CrudApi.User = simpleFixtures.getUser();
  const transaction: CrudApi.Transaction = simpleFixtures.getTransaction();
  const order: CrudApi.Order = simpleFixtures.getOrder();

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

  const user: CrudApi.User = simpleFixtures.getUser();
  const transaction: CrudApi.Transaction = simpleFixtures.getTransaction();
  const order: CrudApi.Order = simpleFixtures.getOrder();
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

  const user: CrudApi.User = simpleFixtures.getUser();
  const transaction: CrudApi.Transaction = simpleFixtures.getTransaction();
  const order: CrudApi.Order = simpleFixtures.getOrder();
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
  ] as CrudApi.OrderItem[];

  expect(calculaterServiceFeeItems(fixture, 'HUF')).toMatchSnapshot();
});

test('createInvoice - service fee included', async () => {
  const szamlazzClient: any = {
    issueInvoice: jest
      .fn()
      .mockReturnValue(Promise.resolve('SZAMLAZZCLIENT ISSUEINVOICE RESULT')),
  };

  const user: CrudApi.User = simpleFixtures.getUser();
  const transaction: CrudApi.Transaction = simpleFixtures.getTransaction();
  const order: CrudApi.Order = R.clone(simpleFixtures.getOrder());
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

  expect(
    await createInvoice(szamlazzClient)({ user, transaction, order }),
  ).toMatchSnapshot('the result');

  expect(maskDate(szamlazzClient.issueInvoice.mock.calls)).toMatchSnapshot(
    'issueInvoice calls',
  );
});
