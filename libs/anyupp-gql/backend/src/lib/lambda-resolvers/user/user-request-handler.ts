import { createAnonymUser } from './create-anonym-user.resolver';
import { GraphqlApiClient } from '@bgap/shared/graphql/api-client';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { AnyuppApi } from '@bgap/anyupp-gql/api';

// HANDLER
export const userRequestHandler = {
  createAnonymUser: ({
    crudGraphqlClient,
    cognito,
    consumerUserPoolId,
  }: {
    crudGraphqlClient: GraphqlApiClient;
    cognito: CognitoIdentityServiceProvider;
    consumerUserPoolId: string;
  }) => (_requestPayload: AnyuppApi.CreateAnonymUserMutationVariables) => {
    return createAnonymUser({
      crudGraphqlClient,
      cognito,
      consumerUserPoolId,
    }).toPromise();
  },
};
