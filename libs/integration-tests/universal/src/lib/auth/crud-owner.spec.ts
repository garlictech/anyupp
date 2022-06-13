import { getCrudSdkPublic, CrudSdk } from '@bgap/crud-gql/api';
import {
  otherAdminUsernames,
  testAdminUsername,
  testAdminUserPassword,
} from '@bgap/shared/fixtures';
import { switchMap } from 'rxjs/operators';
import {
  createAuthenticatedCrudSdk,
  createIamCrudSdk,
} from '../../api-clients';

describe.skip('CRUD ownership tests', () => {
  let authSdk: CrudSdk;
  const publicSdk = getCrudSdkPublic();
  const iamSdk = createIamCrudSdk();
  const adminUserId = testAdminUsername;

  const cleanup = async () => {
    await iamSdk.DeleteUser({ input: { id: adminUserId } }).toPromise();
  };

  beforeAll(async () => {
    authSdk = await createAuthenticatedCrudSdk(
      testAdminUsername,
      testAdminUserPassword,
    ).toPromise();

    await cleanup();
    await iamSdk.CreateUser({ input: { id: adminUserId } }).toPromise();
  });

  afterAll(async () => {
    await cleanup();
  });

  it('It should not access own data of AdminUser without signin', done => {
    publicSdk.GetUser({ id: adminUserId }).subscribe({
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
    createAuthenticatedCrudSdk(otherAdminUsernames[0], testAdminUserPassword)
      .pipe(
        switchMap(anotherAuthSdk =>
          anotherAuthSdk.GetUser({ id: adminUserId }),
        ),
      )
      .subscribe({
        error(e) {
          expect(e).toMatchSnapshot();
          done();
        },
      });
  }, 15000);
});
