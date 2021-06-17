import { CrudSdk } from '@bgap/crud-gql/api';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

export interface AdminUserResolverDeps {
  userPoolId: string;
  crudSdk: CrudSdk;
  cognitoidentityserviceprovider: CognitoIdentityServiceProvider;
  userNameGenerator: () => string;
}
