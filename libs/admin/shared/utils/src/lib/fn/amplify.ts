import * as fp from 'lodash/fp';

export const fpMerge = (original: Record<string, unknown>, values: Record<string, unknown>) =>
  fp.merge(original, values);

export const clearDbProperties = <T>(value: T) =>
  fp.omit(['createdAt', 'updatedAt'], <Record<string, unknown>>value);
