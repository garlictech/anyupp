/* eslint-disable @typescript-eslint/no-explicit-any */

import { ServiceFeeType } from '@bgap/domain';

import { addServiceFeeToOrder } from './handle-service-fee';

const useCases = [
  {
    label: 'add service fee - included',
    serviceFeeType: ServiceFeeType.included,
  },
  {
    label: 'add service fee - applicable',
    serviceFeeType: ServiceFeeType.applicable,
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
              tax: 10,
            },
          },
          {
            sumPriceShown: {
              currency: 'HUF',
              priceSum: 100,
              tax: 20,
            },
          },
        ],
      } as any,
      {
        serviceFeePolicy: {
          type: serviceFeeType,
          percentage: 10,
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
              tax: 20,
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
          tax: 20,
        },
      } as any,
      {
        serviceFeePolicy: {
          type: ServiceFeeType.included,
          percentage: 10,
        },
      } as any,
    ),
  ).toMatchSnapshot();
});
