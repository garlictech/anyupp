import * as fp from 'lodash/fp';

export const fpMerge = (
  original: Record<string, unknown>,
  values: Record<string, unknown>,
) => fp.merge(original, values);

export const clearDbProperties = <T>(value: T) =>
  fp.omit(['createdAt', 'updatedAt'], <Record<string, unknown>>value);

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
