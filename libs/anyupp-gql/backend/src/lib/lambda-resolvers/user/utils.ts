import { AnyuppSdk } from '@bgap/anyupp-gql/api';

export interface UserResolverDeps {
  anyuppSdk: AnyuppSdk;
  consumerUserPoolId: string;
}
