import { getSdkRequester, SdkMethodMapper } from '@bgap/gql-sdk';
import { flow } from 'fp-ts/lib/function';
import { getSdk } from '@bgap/domain';

export const getSdkAmplify = flow(getSdkRequester, getSdk);

type RawCrudSdk = ReturnType<typeof getSdkAmplify>;

export type CrudSdk = {
  [Method in keyof RawCrudSdk]: SdkMethodMapper<RawCrudSdk, Method>;
};
