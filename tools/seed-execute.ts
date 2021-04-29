import chalk from 'chalk';
import { delay, switchMap } from 'rxjs/operators';
import {
  seedAdminUser,
  seedBusinessData,
} from '../libs/anyupp-backend-lib/src/lib/seeder/seeder';
import { AWS_CRUD_CONFIG } from '../libs/shared/graphql/api-client/src/lib/crud-api-clients';

// ############
// execute with:
// yarn ts-node --project ./tools/tsconfig.tools.json -r tsconfig-paths/register ./tools/seed-execute.ts

seedAdminUser(AWS_CRUD_CONFIG.aws_user_pools_id)
  .pipe(
    delay(2000),
    switchMap(userId => seedBusinessData(userId)),
  )
  .subscribe({
    complete() {
      console.log(chalk.greenBright.bold('### SEEDING IS SUCCESSFUL ###'));
    },
    error(error) {
      console.error('SEEDER ERROR', error);
    },
  });
