import * as CrudApi from '@bgap/crud-gql/api';
import { handleRkeeperProducts } from '@bgap/rkeeper-api';

console.log('UNIT ID', process.env.unitId);
console.log('DATA', process.env.rawData);

const sdk = CrudApi.getCrudSdkForIAM(
  process.env.AWS_ACCESS_KEY_ID || '',
  process.env.AWS_SECRET_ACCESS_KEY || '',
);

handleRkeeperProducts(sdk)(
  process.env.unitId || '',
  JSON.parse(process.env.rawData || '{}'),
).subscribe();
