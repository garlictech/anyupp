import { AUTH_TYPE } from 'aws-appsync';
import { Auth } from '@aws-amplify/auth';
import { GraphqlApiClient } from './graphql-api-client';
import { CrudApiConfig } from './types';

export class GraphqlApiFp {
  static createAuthenticatedClient(
    config: CrudApiConfig,
    disableOffline: boolean,
  ): GraphqlApiClient {
    return new GraphqlApiClient(config, {
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
    });
  }

  static createPublicClient(
    config: CrudApiConfig,
    disableOffline: boolean,
  ): GraphqlApiClient {
    return new GraphqlApiClient(config, {
      auth: {
        type: AUTH_TYPE.API_KEY,
        apiKey: config.aws_appsync_apiKey,
      },
      offlineConfig: {
        keyPrefix: 'public',
      },
      disableOffline,
    });
  }

  static createAdminClient(
    config: CrudApiConfig,
    disableOffline: boolean,
  ): GraphqlApiClient {
    return new GraphqlApiClient(config, {
      auth: {
        type: AUTH_TYPE.AWS_IAM,
        credentials: () => Auth.currentCredentials(),
      },
      offlineConfig: {
        keyPrefix: 'admin',
      },
      disableOffline,
    });
  }

  static createBackendClient(
    config: CrudApiConfig,
    accessKeyId: string,
    secretAccessKey: string,
  ): GraphqlApiClient {
    Auth.configure();

    return new GraphqlApiClient(config, {
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
    });
  }
}
