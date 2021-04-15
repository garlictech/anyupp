import { awsConfig } from '@bgap/crud-gql/api';
import { config } from '@bgap/shared/config';
import { ICrudApiConfig } from '@bgap/shared/types';
import { GraphqlApiFp } from './graphql-api-fp';

const AWS_APPSYNC_CONFIG: ICrudApiConfig = {
  ...awsConfig,
  aws_appsync_apiKey: config.GraphqlApiKey,
  aws_appsync_graphqlEndpoint: config.GraphqlApiUrl,
};

export const appsyncGraphQlClient = GraphqlApiFp.createPublicClient(
  AWS_APPSYNC_CONFIG,
  console,
  true,
);

const AWS_AMPLIFY_CONFIG: ICrudApiConfig = {
  ...awsConfig,
};

export const amplifyGraphQlClient = GraphqlApiFp.createPublicClient(
  AWS_AMPLIFY_CONFIG,
  console,
  true,
);
