import {
  GraphqlApiClient,
  GraphqlApiFp,
} from '@bgap/shared/graphql/api-client';
import { AnyuppSdk, getSdkAnyupp } from './sdk';
import { pipe } from 'fp-ts/function';
import { awsConfig } from '@bgap/crud-gql/api';
import { config } from '@bgap/shared/config';

export const appsyncConfig = {
  ...awsConfig,
  aws_appsync_apiKey: config.AnyuppGraphqlApiKey,
  aws_appsync_graphqlEndpoint: config.AnyuppGraphqlApiUrl,
};

const createSdk = (gqlClient: GraphqlApiClient) =>
  getSdkAnyupp(gqlClient._client) as unknown as AnyuppSdk;

export const getAnyuppSdkForIAM = (
  awsAccesskeyId: string,
  awsSecretAccessKey: string,
) =>
  pipe(
    GraphqlApiFp.createBackendClient(
      appsyncConfig,
      awsAccesskeyId,
      awsSecretAccessKey,
    ),
    createSdk,
  );

export const getAnyuppSdkForUserPool = () =>
  pipe(GraphqlApiFp.createAuthenticatedClient(appsyncConfig, true), createSdk);

export const getAnyuppSdkPublic = () =>
  pipe(GraphqlApiFp.createPublicClient(appsyncConfig, true), createSdk);
