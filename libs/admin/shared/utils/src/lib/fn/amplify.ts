import * as fp from 'lodash/fp';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fpMerge = (original: any, values: any) => {
  return fp.merge(original, values);
};

export const clearDbProperties = <T>(value: T): T => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { createdAt, updatedAt, ...cleaned } = <any>(value);

  return cleaned;
}
