import * as CrudApi from '@bgap/crud-gql/api';
import { net2gross } from '@bgap/admin/shared/utils';
import { cloneDeep } from 'lodash/fp';

export const calculateOrderSum = (
  order: CrudApi.Order,
  formatterFn: (value: string | number | undefined, currency: string) => string,
) => {
  if (order.servingMode === CrudApi.ServingMode.takeaway) {
    // sumPriceShown contains the packaging fee (is set)
    return formatterFn(
      order.sumPriceShown.priceSum,
      order.sumPriceShown.currency,
    );
  } else {
    return formatterFn(
      Math.round(
        order.sumPriceShown.priceSum + (order.serviceFee?.grossPrice || 0),
      ),
      order.sumPriceShown.currency,
    );
  }
};

export const calculatePackagingSum = (
  order: CrudApi.Order,
  formatterFn: (value: string | number | undefined, currency: string) => string,
) => {
  if (order.servingMode === CrudApi.ServingMode.takeaway) {
    // sumPriceShown contains the packaging fee (is set)
    return order.packagingSum
      ? formatterFn(
          net2gross(
            order.packagingSum?.netPrice,
            order.packagingSum.taxPercentage,
          ),
          order.sumPriceShown.currency,
        )
      : undefined;
  } else {
    return;
  }
};

export const calculateServiceFeeSum = (
  order: CrudApi.Order,
  formatterFn: (value: string | number | undefined, currency: string) => string,
) => {
  if (
    order.serviceFeePolicy?.type === CrudApi.ServiceFeeType.applicable &&
    order.servingMode === CrudApi.ServingMode.inplace
  ) {
    // sumPriceShown contains the packaging fee (is set)
    return order.serviceFee
      ? formatterFn(
          order.serviceFee.grossPrice || 0,
          order.sumPriceShown.currency,
        )
      : undefined;
  } else {
    return;
  }
};

export const addIncludedServiceFeeToOrderItems = (order: CrudApi.Order) => {
  if (
    order.serviceFeePolicy?.type === CrudApi.ServiceFeeType.included &&
    order.servingMode === CrudApi.ServingMode.inplace
  ) {
    return order.items.map(item => ({
      ...item,
      sumPriceShown: {
        ...item.sumPriceShown,
        priceSum:
          item.sumPriceShown.priceSum +
          net2gross(
            item.serviceFee?.netPrice || 0,
            item.serviceFee?.taxPercentage || 0,
          ),
      },
    }));
  } else {
    return cloneDeep(order.items);
  }
};
