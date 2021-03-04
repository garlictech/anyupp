import { cleanObject } from '@bgap/shared/utils';
import { omit as _omit } from 'lodash-es';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const simpleAmplifyUpdater = (value: any) => (updated: any) => {
  const updateObj = cleanObject(value);

  Object.keys(updateObj).forEach(k => {
    updated[k] = updateObj[k];
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const clearDbProperties = <T>(value: T): T => (_omit(<any>cleanObject(value), ['_deleted', '_lastChangedAt', '_version']));

