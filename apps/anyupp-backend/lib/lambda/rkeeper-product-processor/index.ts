import * as CrudApi from '@bgap/crud-gql/api';
import { handleRkeeperProducts } from '@bgap/rkeeper-api';

const sdk = CrudApi.getCrudSdkForIAM(
  process.env.API_ACCESS_KEY_ID || '',
  process.env.API_SECRET_ACCESS_KEY || '',
);

handleRkeeperProducts(sdk)(
  process.env.unitId || '',
  JSON.parse(process.env.rawData || '{}'),
).subscribe();
