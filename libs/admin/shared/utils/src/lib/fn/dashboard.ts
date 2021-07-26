import * as CrudApi from '@bgap/crud-gql/api';
import { UnpayCategoryStatObjItem } from '@bgap/shared/types';

export const calculateUnpayCategoryStat = (
  category: CrudApi.UnpayCategory,
  categoryOrders: CrudApi.Order[],
): UnpayCategoryStatObjItem => {
  return {
    category,
    count: categoryOrders.length,
    sum: categoryOrders.reduce(
      (prev, cur) => prev + cur.sumPriceShown.priceSum,
      0,
    ),
    uniqueUsersCount: [...new Set(categoryOrders.map(o => o.userId))].length,
  };
};
