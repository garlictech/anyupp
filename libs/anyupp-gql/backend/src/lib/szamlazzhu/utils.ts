import { flow, pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import * as R from 'ramda';

import {
  LocalizedItem,
  Maybe,
  OrderItem,
  Price,
  ServiceFeePolicy,
} from '@bgap/domain';

export const getTranslation = (localizedItem: LocalizedItem) =>
  localizedItem['hu'] || localizedItem['en'] || 'ismeretlen termék';

export const calculaterServiceFeeItems = (
  serviceFeePolicy: Maybe<ServiceFeePolicy> | undefined,
  items: OrderItem[],
  currency: string,
): [string, Price][] =>
  pipe(
    items,
    R.map(items => items.serviceFee),
    R.reject(R.isNil),
    x => x as Price[],
    R.groupBy((fee: Price) => fee.taxPercentage.toString()),
    fp.mapValues(
      flow(
        R.map(item => item.netPrice),
        R.sum,
      ),
    ),
    R.toPairs,
    R.map(([taxPercentage, sum]: [string, number]) => [
      parseFloat(taxPercentage),
      sum,
    ]),
    R.map(([taxPercentage, netPrice]) => [
      `Szervizdíj - ${serviceFeePolicy?.percentage}% ÁFA tartalommal`,
      {
        taxPercentage,
        netPrice,
        currency,
      },
    ]),
  );
