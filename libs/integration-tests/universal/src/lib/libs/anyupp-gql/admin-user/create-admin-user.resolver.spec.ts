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
  createAuthenticatedCrudSdk,
  createIamCrudSdk,
} from '../../../../api-clients';
import { tableConfig } from '@bgap/crud-gql/backend';
import { CrudSdk } from '@bgap/crud-gql/api';
import * as CrudApi from '@bgap/crud-gql/api';

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'eu-west-1',
});

const email = 'anonymuser+foobar@anyupp.com';
const userName = 'int-test-user-name';
const phone = '+6834832765328';
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

  const errorChecker = (label: string) =>
    catchError(err => {
      expect(err).toMatchSnapshot(label);
      return of({});
    });

  const testLogic = ({
    label,
    deleteOp,
    createOp,
    getOp,
  }: {
    label: string;
    deleteOp: CrudSdk['DeleteAdminUser'];
    createOp: CrudSdk['CreateAdminUser'];
    getOp: CrudSdk['GetAdminUser'];
  }) =>
    deleteOp({ input: { id: userName } }).pipe(
      // yes, we can get anything here
      catchError((err: any) =>
        JSON.stringify(err).includes('User does not exist')
          ? of({})
          : throwError(err),
      ),
      // ERROR - Invalid phoneNumber
      switchMap(() =>
        createOp({
          input: {
            email: 'NOT_VALID_EMAIL',
            name: 'Mekk elek',
            phone: 'NOT_VALID_PHONE_NUMBER',
          },
        }).pipe(errorChecker(label + ': Malformed phone number')),
      ),
      // ERROR - Invalid mail
      switchMap(() =>
        createOp({
          input: {
            email: 'NOT_VALID_EMAIL',
            name: 'Mekk elek',
            phone,
          },
        }).pipe(errorChecker(label + ': Malformed email')),
      ),
      // SUCCESSFULL CREATE
      switchMap(() =>
        createOp({
          input: {
            email,
            name: 'Mekk Elek',
            phone,
            id: userName,
          },
        }).pipe(
          catchError(err => {
            console.error(
              'SHOULD NOT THROW - successful-create-step',
              JSON.stringify(err, null, 2),
            );
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
            id: userName,
          },
        }).pipe(
          catchError(err => {
            expect(err).toMatchSnapshot(
              label + ': Should not create existing user',
            );
            return of({});
          }),
        ),
      ),
      switchMap(() => getOp({ id: userName })),
      tap(res =>
        expect(res).toMatchSnapshot(
          {
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          label + ': read back',
        ),
      ),
      // Cleanup
      switchMap(() => deleteOp({ input: { id: userName } })),
      tap(result => {
        expect(result).toMatchSnapshot(label + ': Cleanup');
      }),
      // try deleting a nonexisting user
      switchMap(() => deleteOp({ input: { id: 'NONEXISTING-USER' } })),
      tap(result => {
        expect(result).toMatchSnapshot(label + ': Deleting nonexisting user');
      }),
    );

  test('Admin user should be created/deleted with resolver code', done => {
    const sdk = createIamCrudSdk();
    testLogic({
      label: 'RESOLVER CODE',
      createOp: (x: CrudApi.CreateAdminUserMutationVariables) =>
        createAdminUser(x)(deps),
      deleteOp: x => deleteAdminUser(x)(deps),
      getOp: sdk.GetAdminUser,
    }).subscribe(() => done());
  }, 60000);

  test('Admin user should be created/deleted with authenticated API call', done => {
    createAuthenticatedCrudSdk(testAdminUsername, testAdminUserPassword)
      .pipe(
        switchMap(sdk =>
          testLogic({
            label: 'Auth CRUD api call',
            createOp: sdk.CreateAdminUser,
            deleteOp: sdk.DeleteAdminUser,
            getOp: sdk.GetAdminUser,
          }),
        ),
      )
      .subscribe(() => done());
  }, 60000);

  test('Admin user should be created/deleted with IAM API call', done => {
    const sdk = createIamCrudSdk();
    testLogic({
      label: 'IAM API call',
      createOp: sdk.CreateAdminUser,
      deleteOp: sdk.DeleteAdminUser,
      getOp: sdk.GetAdminUser,
    }).subscribe(() => done());
  }, 60000);
});
