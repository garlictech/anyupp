import { timeZonesNames } from '@vvo/tzdb';
import { KeyValue } from '@bgap/shared/types';
import * as CrudApi from '@bgap/crud-gql/api';

export const timeZoneOptions = timeZonesNames.map(n => ({
  key: n,
  value: n,
}));

export const orderPolicyOptions = [
  CrudApi.OrderPolicy.full,
  CrudApi.OrderPolicy.placeonly,
  CrudApi.OrderPolicy.placewithpaymenttype,
  CrudApi.OrderPolicy.noorders,
].map(
  (policy): KeyValue => ({
    key: policy,
    value: `common.orderPolicy.${policy}`,
  }),
);

export const soldOutPolicyOptions = [
  CrudApi.SoldOutVisibilityPolicy.faded,
  CrudApi.SoldOutVisibilityPolicy.invisible,
].map(
  (policy): KeyValue => ({
    key: policy,
    value: `common.soldOutPolicy.${policy}`,
  }),
);

export const orderPaymentPolicyOptions = [
  CrudApi.OrderPaymentPolicy.prepay,
  CrudApi.OrderPaymentPolicy.afterpay,
].map(
  (policy): KeyValue => ({
    key: policy,
    value: `common.orderPaymentPolicy.${policy}`,
  }),
);
