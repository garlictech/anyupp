import { config } from '@bgap/shared/config';
export const testAdminUsername = 'test@anyupp.com';
export const testAdminUserPassword = 'Testtesttest12_';
import Amplify from 'aws-amplify';
import { awsConfig } from '@bgap/crud-gql/api';

const { AnyuppGraphqlApiKey, AnyuppGraphqlApiUrl } = config;
export { AnyuppGraphqlApiUrl, AnyuppGraphqlApiKey };

export const configureAmplify = () => {
  Amplify.configure({
    ...awsConfig,
    // See: https://github.com/aws-amplify/amplify-js/issues/6552#issuecomment-682259256
    authenticationFlowType: 'USER_PASSWORD_AUTH',
    aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  });
};
