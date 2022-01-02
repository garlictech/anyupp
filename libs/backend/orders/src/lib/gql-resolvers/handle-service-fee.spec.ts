/* eslint-disable @typescript-eslint/no-explicit-any */
import * as CrudApi from '@bgap/crud-gql/api';
import { addServiceFeeToOrder } from './handle-service-fee';

const useCases = [
  {
    label: 'add service fee - included',
    serviceFeeType: CrudApi.ServiceFeeType.included,
  },
  {
    label: 'add service fee - applicable',
    serviceFeeType: CrudApi.ServiceFeeType.applicable,
  },
  {
    label: 'add service fee - nofee',
    serviceFeeType: CrudApi.ServiceFeeType.nofee,
  },
];

test.each(useCases)('Adding service fee', ({ label, serviceFeeType }) => {
  expect(
    addServiceFeeToOrder(
      {
        sumPriceShown: {
          currency: 'HUF',
          priceSum: 200,
        },
        items: [
          {
            sumPriceShown: {
              currency: 'HUF',
              priceSum: 100,
            },
          },
          {
            sumPriceShown: {
              currency: 'HUF',
              priceSum: 100,
            },
          },
        ],
      } as any,
      {
        serviceFeePolicy: {
          type: serviceFeeType,
          percentage: 10,
          taxPercentage: 20,
        },
      } as any,
    ),
  ).toMatchSnapshot(label);
});

test('No service fee defined', () => {
  expect(
    addServiceFeeToOrder(
      {
        sumPriceShown: {
          currency: 'HUF',
          priceSum: 100,
        },
        items: [
          {
            sumPriceShown: {
              currency: 'HUF',
              priceSum: 100,
            },
          },
        ],
      } as any,
      {} as any,
    ),
  ).toMatchSnapshot();
});

test('No items defined', () => {
  expect(
    addServiceFeeToOrder(
      {
        sumPriceShown: {
          currency: 'HUF',
          priceSum: 200,
        },
      } as any,
      {
        serviceFeePolicy: {
          type: CrudApi.ServiceFeeType.included,
          percentage: 10,
          taxPercentage: 20,
        },
      } as any,
    ),
  ).toMatchSnapshot();
});
