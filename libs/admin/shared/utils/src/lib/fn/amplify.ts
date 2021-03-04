import { cleanObject } from '@bgap/shared/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const amplifyObjectUpdater = (value: any) => (updated: any) => {
  const updateObj = cleanObject(value);

  Object.keys(updateObj).forEach(k => {
    updated[k] = updateObj[k];
  });
}

export const clearDbProperties = <T>(value: T): T => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { _deleted, _lastChangedAt, _version, ...cleaned } = <any>value;
  return cleaned;
}

