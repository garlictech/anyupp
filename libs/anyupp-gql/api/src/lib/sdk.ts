import { getSdk } from './generated/anyupp-api';
import { getSdkRequester, SdkMethodMapper } from '@bgap/gql-sdk';
import { flow } from 'fp-ts/lib/function';

export const getSdkAnyupp = flow(getSdkRequester, getSdk);

type RawAnyuppSdk = ReturnType<typeof getSdkAnyupp>;

export type AnyuppSdk = {
  [Method in keyof ReturnType<typeof getSdkAnyupp>]: SdkMethodMapper<
    RawAnyuppSdk,
    Method
  >;
};
