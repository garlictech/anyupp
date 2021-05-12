import { getSdk } from './generated/api';
import { getSdkRequester, SdkMethodMapper } from '@bgap/gql-sdk';
import { flow } from 'fp-ts/lib/function';

export const getSdkAmplify = flow(getSdkRequester, getSdk);

type RawAmplifySdk = ReturnType<typeof getSdkAmplify>;

export type AmplifySdk = {
  [Method in keyof ReturnType<typeof getSdkAmplify>]: SdkMethodMapper<
    RawAmplifySdk,
    Method
  >;
};
