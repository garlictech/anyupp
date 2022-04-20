import * as CrudApi from '../libs/crud-gql/api/src';
import { regenerateUnitData } from '../libs/backend/units/src/lib/gql-resolvers';

const awsAccessKeyId =
  process.env.API_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '';

const awsSecretAccessKey =
  process.env.API_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '';

const crudSdk = CrudApi.getCrudSdkForIAM(awsAccessKeyId, awsSecretAccessKey);

regenerateUnitData(crudSdk)('-MGMw7p0gQsX31ZLZOkK').subscribe({
  error: err => console.error(err),
});
