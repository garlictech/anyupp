import { awsConfig } from '@bgap/admin/amplify-api';
import { CONFIG } from '@bgap/shared/config';
import { IAmplifyApiConfig } from '@bgap/shared/types';
import { GraphqlApiFp } from './graphql-api-fp';

const AWS_APPSYNC_CONFIG: IAmplifyApiConfig = {
  api_key: CONFIG.GraphqlApiKey,
  aws_appsync_graphqlEndpoint: CONFIG.GraphqlApiUrl,
  aws_appsync_region: awsConfig.aws_appsync_region,
  aws_user_pools_id: awsConfig.aws_user_pools_id,
  aws_user_pools_web_client_id: awsConfig.aws_user_pools_web_client_id,
  // ...awsConfig,
};

export const appsyncGraphQlClient = GraphqlApiFp.createPublicClient(
  AWS_APPSYNC_CONFIG,
  console,
  true,
);

const AWS_AMPLIFY_CONFIG: IAmplifyApiConfig = {
  api_key: awsConfig.aws_appsync_apiKey,
  ...awsConfig,
};

export const amplifyGraphQlClient = GraphqlApiFp.createPublicClient(
  AWS_AMPLIFY_CONFIG,
  console,
  true,
);
