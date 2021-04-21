import * as fp from 'lodash/fp';

export const fpMerge = (
  original: Record<string, unknown>,
  values: Record<string, unknown>,
) => fp.merge(original, values);

export const clearDbProperties = <T>(value: T) =>
  fp.omit(['createdAt', 'updatedAt'], <Record<string, unknown>>value);

export const clearObjectType = (obj: any) => {
  let t = obj;

  for (let v in t) {
    if (typeof t[v] === 'object')
      if (!t[v].length) delete t[v];
      else clearObjectType(t[v]);
    else if (v === '__typename') delete t[v];
  }
  return t;
};
