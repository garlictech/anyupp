// ############
// execute with:
// yarn ts-node --project ./tools/tsconfig.tools.json -r tsconfig-paths/register ./tools/seed-execute.ts

import { awsConfig, getCrudSdkForIAM } from '../libs/crud-gql/api/src';
import { config } from '../libs/shared/config/src';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { seedAll, SeederDependencies } from '../libs/backend/seeder/src';

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: process.env.AWS_REGION || '',
});

const AdminUserPoolId = awsConfig.aws_user_pools_id;
const ConsumerUserPoolId = config.ConsumerUserPoolId;
const awsAccessKeyId =
  process.env.API_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '';

const awsSecretAccessKey =
  process.env.API_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '';

const seederDeps: SeederDependencies = {
  crudSdk: getCrudSdkForIAM(awsAccessKeyId, awsSecretAccessKey),
  userPoolId: AdminUserPoolId,
  consumerUserPoolId: ConsumerUserPoolId,
  cognitoidentityserviceprovider,
};

(async function execute() {
  await seedAll(seederDeps).toPromise();
})();
