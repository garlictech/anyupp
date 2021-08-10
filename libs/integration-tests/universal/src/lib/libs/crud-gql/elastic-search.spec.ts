import * as CrudApi from '@bgap/crud-gql/api';
import {
  getCognitoUsername,
  testAdminUsername,
  testAdminUserPassword,
} from '@bgap/shared/fixtures';
import { Auth } from 'aws-amplify';
import { from, of } from 'rxjs';
import {
  concatMap,
  map,
  mergeMap,
  switchMap,
  tap,
  toArray,
} from 'rxjs/operators';
import { pipeDebug } from '../../../../../../shared/utils/src/lib/fn/rxjs.utils';
import { createAuthenticatedCrudSdk } from '../../../api-clients';
const chalk = require('chalk');

describe('ElasticSearch related tests', () => {
  describe('SearchFoo returns data that are non exists in the DB', () => {
    let authSdk: CrudApi.CrudSdk;

    beforeAll(async () => {
      authSdk = await createAuthenticatedCrudSdk(
        getCognitoUsername(testAdminUsername),
        testAdminUserPassword,
      ).toPromise();
    }, 15000);

    afterAll(async () => {
      await Auth.signOut();
    });

    it('search should return only existing records', done => {
      authSdk
        .SearchProductCategorys({})
        .pipe(
          map(response => response?.items),
          pipeDebug('### RESPONSE of the SEARCH'),
          switchMap(items => (items ? from(items) : of(undefined))),
          concatMap(item =>
            item?.id
              ? authSdk.GetProductCategory({ id: item.id }).pipe(
                  map(x => {
                    if (!x) {
                      console.log(
                        chalk.red(`Item with ID ${item.id} is MISSING from DB`),
                        chalk.red(JSON.stringify(item, undefined, 2)),
                      );
                      return undefined;
                    } else {
                      console.log(
                        chalk.green(`We have item with ID ${item.id} in DB`),
                        chalk.green(JSON.stringify(item, undefined, 2)),
                      );
                      return item.id;
                    }
                  }),
                )
              : of(undefined),
          ),
          toArray(),
        )
        .subscribe({
          next(x) {
            console.log(
              chalk.yellow.bold(
                `LOOK at the ${chalk.underline(
                  'CREATED_AT',
                )} and ${chalk.underline('UPDATEDAT_AT')} fields !!!`,
              ),
            );
            done();
            expect(x).not.toContain(undefined);
          },
        });
    }, 10000);
  });
});
