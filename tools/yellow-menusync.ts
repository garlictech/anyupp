// ############
// execute from project root with:
// yarn ts-node --project ./tools/tsconfig.json -r tsconfig-paths/register ./tools/yellow-menusync.ts
import * as fs from 'fs';
import { handleRkeeperProducts } from '../libs/rkeeper-api/src/';

import { createIamCrudSdk } from '../libs/integration-tests/universal/src/api-clients';

const rawData = JSON.parse(
  fs
    .readFileSync(
      __dirname +
        '/../libs/integration-tests/universal/src/lib/libs/rkeeper-api/menu-data.json',
    )
    .toString(),
);

const crudSdk = createIamCrudSdk();
const yellowExternalUnitId = '109150001';

handleRkeeperProducts(crudSdk)(yellowExternalUnitId)(rawData).subscribe();
