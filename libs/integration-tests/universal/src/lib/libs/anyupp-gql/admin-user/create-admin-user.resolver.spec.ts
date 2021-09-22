import {
  AdminUserResolverDeps,
  createAdminUser,
  deleteAdminUser,
} from '@bgap/anyupp-gql/backend';
import { awsConfig } from '@bgap/crud-gql/api';
import {
  testAdminUsername,
  testAdminUserPassword,
} from '@bgap/shared/fixtures';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { defer, iif, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import {
  createAuthenticatedAnyuppSdk,
  createIamCrudSdk,
} from '../../../../api-clients';

const DEBUG_MODE_TEST_WITH_LOCALE_CODE = true; // SHOULD STAY to LOCAL CODE test because the userName generator works only locally
const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'eu-west-1',
});

const email = 'foobar@anyupp.com';
const userName = 'int-test-user-name';
const phone = '+1234567892';
const staticUserNameGenerator = () => userName;

describe('Admin user creation/deletion', () => {
  const authAnyuppSdk = createAuthenticatedAnyuppSdk(
    testAdminUsername,
    testAdminUserPassword,
  );
  const deps: AdminUserResolverDeps = {
    userPoolId: awsConfig.aws_user_pools_id,
    crudSdk: createIamCrudSdk(),
    cognitoidentityserviceprovider,
    userNameGenerator: staticUserNameGenerator,
  };

  test('Admin user should be created/deleted', done => {
    authAnyuppSdk
      .pipe(
        switchMap(({ authAnyuppSdk: sdk }) =>
          iif(
            () => DEBUG_MODE_TEST_WITH_LOCALE_CODE,
            defer(() => deleteAdminUser({ userName })(deps)),
            sdk.DeleteAdminUser({ userName }),
          ).pipe(
            catchError((err: Error) => {
              // console.log('***', err);
              console.log('DEL - OK');
              if (err.message.includes('User does not exist')) {
                return of({});
              }
              return throwError(err);
            }),
            // ERROR - Invalid phoneNumber
            switchMap(() => {
              const input = {
                email: 'NOT_VALID_EMAIL',
                name: 'Mekk elek',
                phone: 'NOT_VALID_PHONE_NUMBER',
              };
              return iif(
                () => DEBUG_MODE_TEST_WITH_LOCALE_CODE,
                defer(() => createAdminUser({ input })(deps)),
                sdk.CreateAdminUser({ input }),
              ).pipe(
                catchError(err => {
                  expect(err).toMatchSnapshot('Invalid phone number error');
                  console.log('INVALID PHONE - OK');
                  return of({});
                }),
              );
            }),
            // ERROR - Invalid mail
            switchMap(() => {
              const input = {
                email: 'NOT_VALID_EMAIL',
                name: 'Mekk elek',
                phone,
              };
              return iif(
                () => DEBUG_MODE_TEST_WITH_LOCALE_CODE,
                defer(() => createAdminUser({ input })(deps)),
                sdk.CreateAdminUser({ input }),
              ).pipe(
                catchError(err => {
                  expect(err).toMatchSnapshot('Malformed email error');
                  console.log('INVALID MAIL - OK');
                  return of({});
                }),
              );
            }),
            // SUCCESSFULL CREATE
            switchMap(() => {
              const input = {
                email,
                name: 'Mekk Elek',
                phone,
              };
              return iif(
                () => DEBUG_MODE_TEST_WITH_LOCALE_CODE,
                defer(() => createAdminUser({ input })(deps)),
                sdk.CreateAdminUser({ input }),
              ).pipe(
                catchError(err => {
                  console.error(
                    'SHOULD NOT THROW - successful-create-step',
                    err,
                  );
                  return throwError(err);
                }),
                tap({
                  next() {
                    console.log('SUCCESFULL CREATE - OK');
                  },
                }),
              );
            }),
            // ERROR - Existing user
            switchMap(() => {
              const input = {
                email,
                name: 'Mekk Elek',
                phone,
              };
              return iif(
                () => DEBUG_MODE_TEST_WITH_LOCALE_CODE,
                defer(() => createAdminUser({ input })(deps)),
                sdk.CreateAdminUser({ input }),
              ).pipe(
                catchError(err => {
                  expect(err).toMatchSnapshot(
                    'Should not create existing user',
                  );
                  console.log('EXISTING USER - OK');
                  return of({});
                }),
              );
            }),
            // Cleanup
            switchMap(() =>
              iif(
                () => DEBUG_MODE_TEST_WITH_LOCALE_CODE,
                defer(() => deleteAdminUser({ userName })(deps)),
                sdk.DeleteAdminUser({ userName }),
              ),
            ),
            tap(result => {
              expect(result).toMatchSnapshot('Cleanup');
              console.log('CLEANUP - OK');
            }),
          ),
        ),
      )
      .subscribe(() => done());
  }, 25000);
});
