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
import { CognitoIdentityServiceProvider, DynamoDB } from 'aws-sdk';
import { of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import {
  createAuthenticatedAnyuppSdk,
  createAuthenticatedCrudSdk,
  createIamCrudSdk,
} from '../../../../api-clients';
import { tableConfig } from '@bgap/crud-gql/backend';
import { CrudSdk } from '@bgap/crud-gql/api';
import * as CrudApi from '@bgap/crud-gql/api';
import { AnyuppSdk } from '@bgap/anyupp-gql/api';

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'eu-west-1',
});

const email = 'anonyuser+foobar@anyupp.com';
const userName = 'int-test-user-name';
const phone = '+1234567892';
const staticUserNameGenerator = () => userName;
const docClient = new DynamoDB.DocumentClient();

describe('Admin user creation/deletion', () => {
  const deps: AdminUserResolverDeps = {
    userPoolId: awsConfig.aws_user_pools_id,
    cognitoidentityserviceprovider,
    userNameGenerator: staticUserNameGenerator,
    docClient,
    adminUserTableName: tableConfig.AdminUser.TableName,
  };

  const testLogic = ({
    deleteOp,
    createOp,
  }: {
    deleteOp: CrudSdk['DeleteAdminUser'] | AnyuppSdk['DeleteAdminUser'];
    createOp: CrudSdk['CreateAdminUser'] | AnyuppSdk['CreateAdminUser'];
  }) =>
    deleteOp({ input: { id: userName } }).pipe(
      // yes, we can get anything here
      catchError((err: any) =>
        err?.code === 'UserNotFoundException' ? of({}) : throwError(err),
      ),
      // ERROR - Invalid phoneNumber
      switchMap(() =>
        createOp({
          input: {
            email: 'NOT_VALID_EMAIL',
            name: 'Mekk elek',
            phone: 'NOT_VALID_PHONE_NUMBER',
          },
        }).pipe(
          catchError(err => {
            expect(err).toMatchSnapshot('Invalid phone number error');
            return of({});
          }),
        ),
      ),
      // ERROR - Invalid mail
      switchMap(() =>
        createOp({
          input: {
            email: 'NOT_VALID_EMAIL',
            name: 'Mekk elek',
            phone,
          },
        }).pipe(
          catchError(err => {
            expect(err).toMatchSnapshot('Malformed email error');
            return of({});
          }),
        ),
      ),
      // SUCCESSFULL CREATE
      switchMap(() =>
        createOp({
          input: {
            email,
            name: 'Mekk Elek',
            phone,
          },
        }).pipe(
          catchError(err => {
            console.error('SHOULD NOT THROW - successful-create-step', err);
            return throwError(err);
          }),
        ),
      ),
      // ERROR - Existing user
      switchMap(() =>
        createOp({
          input: {
            email,
            name: 'Mekk Elek',
            phone,
          },
        }).pipe(
          catchError(err => {
            expect(err).toMatchSnapshot('Should not create existing user');
            return of({});
          }),
        ),
      ),
      // Cleanup
      switchMap(() => deleteOp({ input: { id: userName } })),
      tap(result => {
        expect(result).toMatchSnapshot('Cleanup');
      }),
    );

  test('Admin user should be created/deleted with resolver code', done => {
    testLogic({
      createOp: (x: CrudApi.CreateAdminUserMutationVariables) =>
        createAdminUser(x)(deps),
      deleteOp: x => deleteAdminUser(x)(deps),
    }).subscribe(() => done());
  }, 15000);

  test('Admin user should be created/deleted with authenticated API call', done => {
    createAuthenticatedCrudSdk(testAdminUsername, testAdminUserPassword)
      .pipe(
        switchMap(sdk =>
          testLogic({
            createOp: sdk.CreateAdminUser,
            deleteOp: sdk.DeleteAdminUser,
          }),
        ),
      )
      .subscribe(() => done());
  }, 25000);

  test('Admin user should be created/deleted with authenticated "old" API call', done => {
    createAuthenticatedAnyuppSdk(testAdminUsername, testAdminUserPassword)
      .pipe(
        switchMap(sdk =>
          testLogic({
            createOp: sdk.authAnyuppSdk.CreateAdminUser,
            deleteOp: sdk.authAnyuppSdk.DeleteAdminUser,
          }),
        ),
      )
      .subscribe(() => done());
  }, 25000);

  test.only('Admin user should be created/deleted with IAM API call', done => {
    const sdk = createIamCrudSdk();
    testLogic({
      createOp: sdk.CreateAdminUser,
      deleteOp: sdk.DeleteAdminUser,
    }).subscribe(() => done());
  }, 25000);
});
