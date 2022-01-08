/* eslint-disable @typescript-eslint/no-explicit-any */
import * as CrudApi from '@bgap/crud-gql/api';
import { createInvoice } from './invoice';
import { simpleFixtures, maskDate } from '@bgap/shared/fixtures';

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
