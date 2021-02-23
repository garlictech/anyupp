import { environment } from '../environments/environment';

export const AWS_CONFIG = {
  aws_appsync_graphqlEndpoint: environment.config.GraphqlApiUrl,
  api_key: environment.config.GraphqlApiKey,
  aws_appsync_region: 'eu-west-1',
  aws_project_region: 'eu-west-1',
  aws_cognito_region: 'eu-west-1',
  // aws_cognito_identity_pool_id: environment.config.IdentityPoolId,
  aws_user_pools_id: environment.config.UserPoolId,
  aws_user_pools_web_client_id: environment.config.UserPoolClientId,
  oauth: {
    domain: environment.config.UserPoolDomain,
    scope: ['openid'],
    redirectSignIn: `${environment.config.AdminSiteUrl}/admin/dashboard`,
    redirectSignOut: `${environment.config.AdminSiteUrl}/auth/login`,
    responseType: 'code',
  },
  // aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  // federationTarget: 'COGNITO_USER_AND_IDENTITY_POOLS', ???
};
