import { IKeyValueObject, IOrder } from '../../interfaces';

/*
export const getDailyOrdersSumPerCurrency = (dailyHistoryOrders: IOrder[]): IKeyValueObject => {
  const dailyOrdersSum: IKeyValueObject = {};

  dailyHistoryOrders.forEach(o => {
    if (!dailyOrdersSum[o.sumPriceShown.currency]) {
      dailyOrdersSum[o.sumPriceShown.currency] = 0;
    }
    dailyOrdersSum[o.sumPriceShown.currency] += o.sumPriceShown.priceSum;
  });


  return dailyOrdersSum;
};
*/

export const getDailyOrdersSum = (dailyHistoryOrders: IOrder[]): number => {
  let sum = 0;

  dailyHistoryOrders.forEach((o) => {
    sum += o.sumPriceShown.priceSum;
  });

  return sum;
};
