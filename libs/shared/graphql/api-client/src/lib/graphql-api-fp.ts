import { AUTH_TYPE } from 'aws-appsync/lib';

import { Auth } from '@aws-amplify/auth';
import { IAmplifyApiConfig, ILogger } from '@bgap/shared/types';

import { GraphqlApiClient } from './graphql-api-client';

export class GraphqlApiFp {
  static createAuthenticatedClient(
    config: IAmplifyApiConfig,
    logger: ILogger,
    disableOffline: boolean,
  ): GraphqlApiClient {
    return new GraphqlApiClient(
      config,
      {
        auth: {
          type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
          jwtToken: async () =>
            (await Auth.currentSession()).getIdToken().getJwtToken(),
        },
        complexObjectsCredentials: () => Auth.currentCredentials(),
        offlineConfig: {
          keyPrefix: 'authenticated',
        },
        disableOffline,
      },
      logger,
    );
  }

  static createPublicClient(
    config: IAmplifyApiConfig,
    logger: ILogger,
    disableOffline: boolean,
  ): GraphqlApiClient {
    return new GraphqlApiClient(
      config,
      {
        auth: {
          type: AUTH_TYPE.API_KEY,
          apiKey: config.api_key,
        },
        offlineConfig: {
          keyPrefix: 'public',
        },
        disableOffline,
      },
      logger,
    );
  }

  static createAdminClient(
    config: IAmplifyApiConfig,
    logger: ILogger,
    disableOffline: boolean,
  ): GraphqlApiClient {
    return new GraphqlApiClient(
      config,
      {
        auth: {
          type: AUTH_TYPE.AWS_IAM,
          credentials: () => Auth.currentCredentials(),
        },
        offlineConfig: {
          keyPrefix: 'admin',
        },
        disableOffline,
      },
      logger,
    );
  }

  static createBackendClient(
    config: IAmplifyApiConfig,
    accessKeyId: string,
    secretAccessKey: string,
    logger: ILogger,
  ): GraphqlApiClient {
    return new GraphqlApiClient(
      config,
      {
        url: config.aws_appsync_graphqlEndpoint,
        region: config.aws_appsync_region,
        auth: {
          type: AUTH_TYPE.AWS_IAM,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        },
        disableOffline: true,
      },
      logger,
    );
  }
}
