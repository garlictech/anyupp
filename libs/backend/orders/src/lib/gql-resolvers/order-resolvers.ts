import * as R from 'ramda';
import { OrderPolicy, Unit } from '@bgap/domain';

export const hasSimplifiedOrder = (unit: Unit): boolean =>
  !R.isNil(unit.orderPolicy) && unit.orderPolicy !== OrderPolicy.full;
