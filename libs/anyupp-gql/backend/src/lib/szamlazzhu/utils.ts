import * as CrudApi from '@bgap/crud-gql/api';
import * as R from 'ramda';
import * as fp from 'lodash/fp';
import { flow, pipe } from 'fp-ts/lib/function';

export const getTranslation = (localizedItem: CrudApi.LocalizedItem) =>
  localizedItem['hu'] || localizedItem['en'] || 'ismeretlen termék';

export const calculaterServiceFeeItems = (
  serviceFeePolicy: CrudApi.Maybe<CrudApi.ServiceFeePolicy> | undefined,
  items: CrudApi.OrderItem[],
  currency: string,
): [string, CrudApi.Price][] =>
  pipe(
    items,
    R.map(items => items.serviceFee),
    R.reject(R.isNil),
    x => x as CrudApi.Price[],
    R.groupBy((fee: CrudApi.Price) => fee.taxPercentage.toString()),
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
      `Szervizdíj - ${serviceFeePolicy?.percentage}%`,
      {
        taxPercentage,
        netPrice,
        currency,
      },
    ]),
  );
