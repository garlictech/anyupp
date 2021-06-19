// ############
// execute with:
// yarn ts-node --project ./tools/tsconfig.tools.json -r tsconfig-paths/register ./tools/delete-all-table-data.ts
import { deleteInAllTables } from '../libs/anyupp-backend-lib/src/lib/seeder';

deleteInAllTables().subscribe();
