import { pipe } from 'fp-ts/lib/function';
import * as R from 'ramda';

import { OrderItem } from '@bgap/domain';

// Collect all the non-null netPackagingFee-s that are deep in the order
// config sets, then sum them up
const calculatePackagingFeeOfOrderItemConfigSets = (
  items: OrderItem[],
): number =>
  pipe(
    items,
    R.map(item =>
      pipe(
        item.configSets ?? [],
        R.map(cs => cs.items),
        x => R.reject(R.isNil)(x),
        R.flatten,
        R.map(x => x.netPackagingFee),
        R.reject(R.isNil),
        R.map(x => x * item.quantity),
      ),
    ),
    R.flatten,
    R.reduce(R.add, 0),
  );

const calculatePackagingFeeOfOrderItems = (items: OrderItem[]): number =>
  pipe(
    items,
    R.map(x => x.quantity * (x.netPackagingFee || 0)),
    R.reduce(R.add, 0),
  );

export const calculatePackagingFeeOfOrder = (items: OrderItem[]): number =>
  pipe(
    items,
    R.juxt([
      calculatePackagingFeeOfOrderItems,
      calculatePackagingFeeOfOrderItemConfigSets,
    ]),
    R.sum,
  );
