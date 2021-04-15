import { awsConfig } from '@bgap/crud-gql/api';
import { config } from '@bgap/shared/config';
import { IAmplifyApiConfig } from '@bgap/shared/types';
import { GraphqlApiFp } from './graphql-api-fp';

const AWS_APPSYNC_CONFIG: IAmplifyApiConfig = {
  ...awsConfig,
  aws_appsync_apiKey: config.GraphqlApiKey,
  aws_appsync_graphqlEndpoint: config.GraphqlApiUrl,
};

export const appsyncGraphQlClient = GraphqlApiFp.createPublicClient(
  AWS_APPSYNC_CONFIG,
  console,
  true,
);

const AWS_AMPLIFY_CONFIG: IAmplifyApiConfig = {
  ...awsConfig,
};

export const amplifyGraphQlClient = GraphqlApiFp.createPublicClient(
  AWS_AMPLIFY_CONFIG,
  console,
  true,
);
