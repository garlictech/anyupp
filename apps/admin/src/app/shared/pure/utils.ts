import { IDayInterval } from '@bgap/shared/types/interfaces';

export const customNumberCompare = (
  field: string,
  desc: boolean = false
) => (a: unknown, b: unknown): number => {
  if (+a[field] < +b[field]) {
    return desc ? 1 : -1;
  }
  if (+a[field] > +b[field]) {
    return desc ? -1 : 1;
  }

  return 0;
};

export const customStringCompare = (
  field: string,
  desc: boolean = false
) => (a: unknown, b: unknown): number => {
  if (a[field] < b[field]) {
    return desc ? 1 : -1;
  }
  if (a[field] > b[field]) {
    return desc ? -1 : 1;
  }

  return 0;
};

export const objectToArray = (obj: unknown, idKey: string = '_id') => {
  const arr = [];

  if (!obj) {
    return [];
  }

  Object.keys(obj).forEach((key): void => {
    arr.push({
      [idKey]: key,
      ...obj[key],
    });
  });

  return arr;
};

export const zeroFill = (value: number): string => {
  return ('0' + value).slice(-2);
};

export const dayInterval = (value: string): IDayInterval => {
  const start = new Date(value);
  start.setHours(0, 0, 0, 0);

  const end = new Date(value);
  end.setHours(23, 59, 59, 999);

  return {
    start: start.getTime(),
    end: end.getTime(),
  };
};

export const reducer = (accumulator, currentValue): number =>
  accumulator + currentValue;
