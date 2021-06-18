import { Auth } from '@aws-amplify/auth';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  otherAdminEmails,
  testAdminEmail,
  testAdminUserPassword,
} from '@bgap/shared/fixtures';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  createAuthenticatedCrudSdk,
  createIamCrudSdk,
} from '../../api-clients';

describe.skip('CRUD ownership tests', () => {
  let authSdk: CrudApi.CrudSdk;
  const publicSdk = CrudApi.getCrudSdkPublic();
  const iamSdk = createIamCrudSdk();
  const adminUserId = testAdminEmail.split('@')[0];

  const cleanup = async () => {
    await iamSdk.DeleteUser({ input: { id: adminUserId } }).toPromise();
  };

  beforeAll(async () => {
    authSdk = await createAuthenticatedCrudSdk(
      testAdminEmail,
      testAdminUserPassword,
    ).toPromise();

    cleanup();
    await iamSdk.CreateUser({ input: { id: adminUserId } }).toPromise();
  });

  afterAll(async () => {
    cleanup();
  });

  it('It should not access own data of AdminUser without signin', done => {
    publicSdk.GetUser({ id: adminUserId }).subscribe({
      next: x => console.warn(x),
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  }, 15000);

  it('It should access own data of AdminUser with signin', done => {
    authSdk.GetUser({ id: adminUserId }).subscribe({
      next(data) {
        expect(data?.id).toEqual(adminUserId);
        done();
      },
    });
  }, 15000);

  it('It should not access other users private data even with signin', done => {
    createAuthenticatedCrudSdk(otherAdminEmails[0], testAdminUserPassword)
      .pipe(
        switchMap(anotherAuthSdk =>
          anotherAuthSdk.GetUser({ id: adminUserId }),
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
