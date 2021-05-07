import { IDayInterval, IKeyValueObject } from '@bgap/shared/types';
import { missingParametersError } from './errors';

export const customNumberCompare = (field: string, desc = false) => (
  a: IKeyValueObject,
  b: IKeyValueObject,
): number => {
  if (+a[field] < +b[field]) {
    return desc ? 1 : -1;
  }
  if (+a[field] > +b[field]) {
    return desc ? -1 : 1;
  }

  return 0;
};

export const customStringCompare = (field: string, desc = false) => (
  a: IKeyValueObject,
  b: IKeyValueObject,
): number => {
  if (a[field] < b[field]) {
    return desc ? 1 : -1;
  }
  if (a[field] > b[field]) {
    return desc ? -1 : 1;
  }

  return 0;
};

export const objectToArray = (
  obj: IKeyValueObject | unknown,
  idKey = '_id',
) => {
  const arr: unknown[] = [];

  if (!obj) {
    return [];
  }

  Object.keys(<IKeyValueObject>obj).forEach((key): void => {
    arr.push({
      ...(<IKeyValueObject>obj)[key],
      [idKey]: key,
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

export const reducer = (accumulator: number, currentValue: number): number =>
  accumulator + currentValue;

// Recursively remove undefined/null/emptyString from an object
export const cleanObject = (obj: IKeyValueObject) => {
  const finalObj: IKeyValueObject = {};

  Object.keys(obj).forEach(key => {
    if (obj[key] && Array.isArray(obj[key])) {
      finalObj[key] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (<any[]>obj[key]).forEach(item => {
        if (typeof item === 'object') {
          const itemObj = cleanObject(item);
          if (Object.keys(itemObj).length) {
            finalObj[key].push(itemObj);
          }
        } else {
          finalObj[key].push(item);
        }
      });
    } else if (obj[key] && typeof obj[key] === 'object') {
      const nestedObj = cleanObject(obj[key]);
      if (Object.keys(nestedObj).length) {
        finalObj[key] = nestedObj;
      }
    } else if (obj[key] !== '' && obj[key] !== undefined && obj[key] !== null) {
      finalObj[key] = obj[key];
    }
  });

  return finalObj;
};

// Recursively remove '__typename' fields from GQL data object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const removeNestedTypeNameField = (obj: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalObj: any = {};

  Object.keys(obj).forEach(key => {
    if (obj[key] && Array.isArray(obj[key])) {
      finalObj[key] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (<any[]>obj[key]).forEach(item => {
        if (typeof item === 'object') {
          const itemObj = removeNestedTypeNameField(item);
          if (Object.keys(itemObj).length) {
            finalObj[key].push(itemObj);
          }
        } else {
          finalObj[key].push(item);
        }
      });
    } else if (obj[key] && typeof obj[key] === 'object') {
      const nestedObj = removeNestedTypeNameField(obj[key]);
      if (Object.keys(nestedObj).length) {
        finalObj[key] = nestedObj;
      }
    } else if (key !== '__typename') {
      finalObj[key] = obj[key];
    }
  });

  return finalObj;
};


/**
 * Generic type guard, to narrow types
 *
 * usage: if (!isOfType<Stripe.DeletedCard>(deleteCardResponse, 'deleted')) { ... }
 * usage: isOfType<Stripe.Card>(updatedCard, 'object', 'card')
 *
 * @param varToBeChecked - The object that needs type narrowing
 * @param propertyToCheckFor Existence of this field will decide if it is the given T type or not
 * @param propertyValueToCheck The checked property value should equeal this optional value
 */
export const isOfType = <T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  varToBeChecked: any,
  propertyToCheckFor: keyof T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  propertyValueToCheck?: any,
): varToBeChecked is T =>
  (varToBeChecked as T)[propertyToCheckFor] !== undefined &&
  propertyValueToCheck === undefined
    ? true
    : (varToBeChecked as T)[propertyToCheckFor] === propertyValueToCheck;

export const missingParametersCheck = <T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  varToBeChecked: any,
  paramNames: (keyof T)[],
): varToBeChecked is T => {
  for (const paramName of paramNames) {
    if (!isOfType<T>(varToBeChecked, paramName)) {
      throw missingParametersError(paramName as string);
    }
  }
  return true;
};

export const randomString = (length: number) =>
  [...Array(length)].map(() => (~~(Math.random() * 36)).toString(36)).join('');
