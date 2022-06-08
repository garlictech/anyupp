import { flow, pipe } from 'fp-ts/lib/function';
import * as R from 'ramda';

import {
  CreateOrderInput,
  Maybe,
  Price,
  PriceShown,
  ServiceFeePolicy,
  ServiceFeeType,
  Unit,
} from '@bgap/domain';

const round = (num: number) => Math.round(num * 100) / 100;

const getServiceFee = (
  // The order must already contain productPriceSum
  serviceFeePolicy: Maybe<ServiceFeePolicy> | undefined,
  price: PriceShown,
): Price => {
  const serviceFeePercentage = serviceFeePolicy?.percentage ?? 0;
  const serviceFeeTaxPercentage = price.tax;

  const calculateServiceFee = flow(
    R.cond<ServiceFeeType | undefined, number>([
      [
        (feeType?: ServiceFeeType) =>
          feeType === ServiceFeeType.included ||
          feeType === ServiceFeeType.applicable,
        R.always((price.priceSum * serviceFeePercentage) / 100),
      ],
      [R.T, R.always(0)],
    ]),
    round,
  );

  const calculateServiceFeeTax = (grossServiceFee: number): number =>
    pipe(
      (grossServiceFee * serviceFeeTaxPercentage) /
        (100 + serviceFeeTaxPercentage),
      round,
    );

  return pipe(serviceFeePolicy?.type, calculateServiceFee, serviceFee => ({
    currency: price.currency,
    netPrice: serviceFee - calculateServiceFeeTax(serviceFee),
    taxPercentage: serviceFeeTaxPercentage,
  }));
};

export const addServiceFeeToOrder = (
  order: CreateOrderInput,
  unit: Unit,
): CreateOrderInput =>
  pipe(
    order.items ?? [],
    R.map(orderItem => ({
      ...orderItem,
      serviceFee: getServiceFee(unit.serviceFeePolicy, orderItem.sumPriceShown),
    })),
    items => ({
      ...order,
      items,
    }),
    newOrder => ({
      ...newOrder,
      serviceFee: pipe(
        newOrder.items,
        R.map(item => item.serviceFee),
        R.map(
          serviceFee =>
            serviceFee.netPrice * (1 + serviceFee.taxPercentage / 100),
        ),
        R.sum,
        sumFee => ({
          currency: order.sumPriceShown.currency,
          grossPrice: sumFee,
          taxContent: pipe(
            newOrder.items,
            R.map(item => item.serviceFee),
            R.filter(serviceFee => !!serviceFee),
            R.map(
              serviceFee =>
                (serviceFee.netPrice * serviceFee.taxPercentage) / 100,
            ),
            R.sum,
          ),
        }),
      ),
    }),
  );
