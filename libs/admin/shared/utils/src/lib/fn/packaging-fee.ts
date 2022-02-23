export const net2gross = (netPrice: number, taxPercentage: number) =>
  netPrice * 0.01 * (100 + taxPercentage);

export const taxValueFromNetPrice = (netPrice: number, taxPercentage: number) =>
  netPrice * 0.01 * taxPercentage;
