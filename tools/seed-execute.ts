// ############
// execute with:
// yarn ts-node --project ./tools/tsconfig.tools.json -r tsconfig-paths/register ./tools/seed-execute.ts

import { handler } from '../apps/anyupp-backend/lib/lambda/stack-seeder';
import { awsConfig } from '../libs/crud-gql/api/src';

handler({
  RequestType: 'Create',
  ResponseURL: 'http://index.hu',
  StackId: '',
  RequestId: '',
  ServiceToken: 'foobar',
  LogicalResourceId: '',
  ResourceType: '',

  ResourceProperties: {
    AdminUserPoolId: awsConfig.aws_user_pools_id,
    physicalResourceId: 'atyala',
    ServiceToken: 'foobar',
  },
});
