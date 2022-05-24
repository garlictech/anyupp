import { KeyValue } from '@bgap/shared/types';

export const currencyOptions = ['EUR', 'HUF'].map(
  (currency): KeyValue => ({
    key: currency,
    value: currency,
  }),
);
