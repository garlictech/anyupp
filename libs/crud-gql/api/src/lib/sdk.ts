import { getSdk } from './generated/api';
import { getSdkRequester, SdkMethodMapper } from '@bgap/gql-sdk';
import { flow } from 'fp-ts/lib/function';

export const getSdkAmplify = flow(getSdkRequester, getSdk);

type RawCrudSdk = ReturnType<typeof getSdkAmplify>;

export type CrudSdk = {
  [Method in keyof ReturnType<typeof getSdkAmplify>]: SdkMethodMapper<
    RawCrudSdk,
    Method
  >;
};
