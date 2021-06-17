import * as CrudApi from '@bgap/crud-gql/api';
import {
  otherAdminEmails,
  testAdminEmail,
  testAdminUserPassword,
} from '@bgap/shared/fixtures';
import { Auth } from '@aws-amplify/auth';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { createAuthenticatedCrudSdk } from '../../api-clients';

describe('CRUD ownership tests', () => {
  let authSdk: CrudApi.CrudSdk;
  const publicSdk = CrudApi.getCrudSdkPublic();
  const adminUserId = testAdminEmail.split('@')[0];

  beforeAll(async () => {
    authSdk = await createAuthenticatedCrudSdk(
      testAdminEmail,
      testAdminUserPassword,
    ).toPromise();
  });

  it('It should not access own data of AdminUser without signin', done => {
    publicSdk.GetAdminUser({ id: adminUserId }).subscribe({
      next: x => console.warn(x),
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  }, 15000);

  it('It should access own data of AdminUser with signin', done => {
    authSdk.GetAdminUser({ id: adminUserId }).subscribe({
      next(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  }, 15000);

  it('It should not access other users private data even with signin', done => {
    createAuthenticatedCrudSdk(otherAdminEmails[0], testAdminUserPassword)
      .pipe(
        switchMap(anotherAuthSdk =>
          anotherAuthSdk.GetAdminUser({ id: adminUserId }),
        ),
      )
      .subscribe({
        next: x => console.warn(x),
        error(e) {
          expect(e).toMatchSnapshot();
          done();
        },
      });
  }, 15000);
});
