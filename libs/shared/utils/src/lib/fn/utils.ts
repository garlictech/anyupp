import { KeyValueObject, RequiredId } from '@bgap/shared/types';
import { missingParametersError } from './errors';

export const customNumberCompare =
  (field: string, desc = false) =>
  (a: KeyValueObject, b: KeyValueObject): number => {
    if (+a[field] < +b[field]) {
      return desc ? 1 : -1;
    }
    if (+a[field] > +b[field]) {
      return desc ? -1 : 1;
    }

    return 0;
  };

export const externalIdArrayCompare =
  (idArray: string[]) => (a: RequiredId<unknown>, b: RequiredId<unknown>) =>
    idArray.indexOf(a.id) - idArray.indexOf(b.id);

export const customDateCompare =
  (field: string, desc = false) =>
  (a: KeyValueObject, b: KeyValueObject): number => {
    if (new Date(a[field]).getTime() < new Date(b[field]).getTime()) {
      return desc ? 1 : -1;
    }
    if (new Date(a[field]).getTime() > new Date(b[field]).getTime()) {
      return desc ? -1 : 1;
    }

    return 0;
  };

export const customStringCompare =
  (field: string, desc = false) =>
  (a: KeyValueObject, b: KeyValueObject): number => {
    if (a[field] < b[field]) {
      return desc ? 1 : -1;
    }
    if (a[field] > b[field]) {
      return desc ? -1 : 1;
    }

    return 0;
  };

export const objectToArray = (obj: KeyValueObject | unknown, idKey = '_id') => {
  const arr: unknown[] = [];

  if (!obj) {
    return [];
  }

  Object.keys(<KeyValueObject>obj).forEach((key): void => {
    arr.push({
      ...(<KeyValueObject>obj)[key],
      [idKey]: key,
    });
  });

  return arr;
};

export const zeroFill = (value: number): string => {
  return ('0' + value).slice(-2);
};

export const reducer = (accumulator: number, currentValue: number): number =>
  accumulator + currentValue;

// Recursively remove undefined/null/emptyString from an object
export const cleanObject = (obj: KeyValueObject) => {
  const finalObj: KeyValueObject = {};

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

export const jsonParsedOrNull = (src: string) => {
  try {
    return JSON.parse(src);
  } catch {
    return null;
  }
};
