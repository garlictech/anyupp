import { getSdkRequester, SdkMethodMapper } from '@bgap/gql-sdk';
import { flow } from 'fp-ts/lib/function';
import { getSdk } from './generated/anyupp-api';

export const getSdkAnyupp = flow(getSdkRequester, getSdk);

type RawAnyuppSdk = ReturnType<typeof getSdkAnyupp>;

export type AnyuppSdk = {
  [Method in keyof ReturnType<typeof getSdkAnyupp>]: SdkMethodMapper<
    RawAnyuppSdk,
    Method
  >;
};
