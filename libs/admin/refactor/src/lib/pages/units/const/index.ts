import {
  OrderPaymentPolicy,
  OrderPolicy,
  SoldOutVisibilityPolicy,
} from '@bgap/domain';
import { KeyValue } from '@bgap/shared/types';
import { timeZonesNames } from '@vvo/tzdb';

export const timeZoneOptions = timeZonesNames.map(n => ({
  key: n,
  value: n,
}));

export const orderPolicyOptions = [
  OrderPolicy.full,
  OrderPolicy.placeonly,
  OrderPolicy.placewithpaymenttype,
  OrderPolicy.noorders,
].map(
  (policy): KeyValue => ({
    key: policy,
    value: `common.orderPolicy.${policy}`,
  }),
);

export const soldOutPolicyOptions = [
  SoldOutVisibilityPolicy.faded,
  SoldOutVisibilityPolicy.invisible,
].map(
  (policy): KeyValue => ({
    key: policy,
    value: `common.soldOutPolicy.${policy}`,
  }),
);

export const orderPaymentPolicyOptions = [
  OrderPaymentPolicy.prepay,
  OrderPaymentPolicy.afterpay,
].map(
  (policy): KeyValue => ({
    key: policy,
    value: `common.orderPaymentPolicy.${policy}`,
  }),
);
