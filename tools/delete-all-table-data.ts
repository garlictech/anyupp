// ############
// execute with:
// yarn ts-node --project ./tools/tsconfig.json -r tsconfig-paths/register ./tools/delete-all-table-data.ts
import { deleteInAllTables } from '../libs/backend/seeder/src/';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { combineLatest, defer, from } from 'rxjs';
import { map, switchMap, mergeMap, tap } from 'rxjs/operators';
import { config } from '../libs/shared/config/src';
import * as R from 'ramda';
import { flow } from 'fp-ts/lib/function';

deleteInAllTables().subscribe();

// And now, delete all the Cognito users that can be found in any tests.
const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: process.env.AWS_REGION,
});

const cleanUserPool = (UserPoolId: string) =>
  defer(() =>
    from(
      cognitoidentityserviceprovider
        .listUsers({ UserPoolId, Limit: 60 })
        .promise(),
    ),
  ).pipe(
    tap(() =>
      console.warn(
        '*** Deleting cognito users: currently max 60. If there are more users, then handle the Limit parameter, and delete the users in multiple steps.',
      ),
    ),
    map(
      flow(
        x => x.Users ?? [],
        R.map(x => ({
          Username: x.Username,
          UserPoolId,
        })),
      ),
    ),
    switchMap(from),
    mergeMap(params =>
      from(cognitoidentityserviceprovider.adminDeleteUser(params).promise()),
    ),
  );

/*combineLatest([
  cleanUserPool(config.AdminUserPoolId),
  cleanUserPool(config.ConsumerUserPoolId),
]).subscribe();
*/
