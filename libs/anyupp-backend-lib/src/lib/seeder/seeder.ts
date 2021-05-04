import { CrudApi } from '@bgap/crud-gql/api';
import {
  testAdminUsername,
  testAdminUserPassword,
} from '@bgap/shared/fixtures';
import {
  crudBackendGraphQLClient,
  executeMutation,
} from '@bgap/shared/graphql/api-client';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import { combineLatest, from, Observable, of } from 'rxjs';
import {
  catchError,
  delay,
  filter,
  map,
  mapTo,
  switchMap,
} from 'rxjs/operators';
import {
  createTestAdminRoleContext,
  createTestCart,
  createTestChain,
  createTestChainProduct,
  createTestGroup,
  createTestGroupProduct,
  createTestProductCategory,
  createTestRoleContext,
  createTestUnit,
  createTestUnitProduct,
  deleteTestAdminRoleContext,
} from './seed-data-fn';

const username = testAdminUsername;
const password = testAdminUserPassword;

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'eu-west-1',
});

export const createAdminUser = /* GraphQL */ `
  mutation CreateAdminUser(
    $input: CreateAdminUserInput!
    $condition: ModelAdminUserConditionInput
  ) {
    createAdminUser(input: $input, condition: $condition) {
      id
    }
  }
`;

export const seedAdminUser = (UserPoolId: string): Observable<string> =>
  pipe(
    {
      UserPoolId,
      Username: username,
      UserAttributes: [
        {
          Name: 'email',
          Value: username,
        },
        {
          Name: 'phone_number',
          Value: '+123456789013',
        },
      ],
    },
    // CREATE user in Cognito
    params =>
      from(
        cognitoidentityserviceprovider.adminCreateUser(params).promise(),
      ).pipe(
        switchMap(() =>
          from(
            cognitoidentityserviceprovider
              .adminSetUserPassword({
                UserPoolId,
                Username: username,
                Password: password,
                Permanent: true,
              })
              .promise(),
          ),
        ),
        catchError(err => {
          console.warn(
            'Probably normal error during cognito user creation: ',
            err,
          );
          return of({});
        }),
      ),
    // pipeDebug('### Cognito user CREATED'),
    // GET user from Cognito
    switchMap(() =>
      from(
        cognitoidentityserviceprovider
          .adminGetUser({
            UserPoolId,
            Username: username,
          })
          .promise(),
      ),
    ),
    // pipeDebug('### Cognito user GET'),
    map((user: CognitoIdentityServiceProvider.Types.AdminGetUserResponse) =>
      pipe(
        user.UserAttributes,
        fp.find(attr => attr.Name === 'sub'),
        attr => attr?.Value,
      ),
    ),
    filter(fp.negate(fp.isEmpty)),
    map((adminUserId: string) => ({
      id: adminUserId || '',
      name: 'John Doe',
      email: username,
      phone: '123123213',
      profileImage:
        'https://ocdn.eu/pulscms-transforms/1/-rxktkpTURBXy9jMzIxNGM4NWI2NmEzYTAzMjkwMTQ1NGMwZmQ1MDE3ZS5wbmeSlQMAAM0DFM0Bu5UCzQSwAMLD',
    })),
    // pipeDebug('### User TO SAVE in Admin user table'),
    switchMap((input: CrudApi.CreateAdminUserInput) =>
      executeMutation(crudBackendGraphQLClient)<
        CrudApi.CreateAdminUserMutation
      >(createAdminUser, { input }).pipe(
        mapTo(input.id),
        catchError(err => {
          console.warn(
            'Probably normal error during Admin user creation in db: ',
            err,
          );
          return of(input.id);
        }),
      ),
    ),
    map(id => id || 'USER_ID_SHOULD_EXISTS_AT_END_OF_SEEDING'),

    // pipeDebug('### User saved in Admin user table'),
    // mapTo('SUCCESS'),
    // catchError((error: AWSError) => {
    //   console.log(
    //     "Probably 'normal' error: ",
    //     JSON.stringify(error, undefined, 2),
    //   );
    //   // return error.code === 'UsernameExistsException'
    //   //   ? of('SUCCESS')
    //   //   : throwError(error);
    // }),
  );

export const seedBusinessData = (userId: string) =>
  createTestRoleContext(1, 1, 1, 1)
    .pipe(ce('### RoleContext SEED 01'), delay(2000))
    .pipe(
      switchMap(() =>
        combineLatest([
          createTestChain(1).pipe(ce('### Chain SEED 01')),
          createTestGroup(1, 1).pipe(ce('### Group SEED 01')),
          createTestGroup(1, 2).pipe(ce('### Group SEED 02')),
          createTestGroup(2, 1).pipe(ce('### Group SEED 03')),
          createTestUnit(1, 1, 1).pipe(ce('### Unit SEED 01')),
          createTestUnit(1, 1, 2).pipe(ce('### Unit SEED 02')),
          createTestUnit(1, 2, 1).pipe(ce('### Unit SEED 03')),
          createTestProductCategory(1, 1).pipe(ce('### ProdCat SEED 01')),
          createTestProductCategory(1, 2).pipe(ce('### ProdCat SEED 02')),
          createTestChainProduct(1, 1, 1).pipe(ce('### ChainProduct SEED 01')),
          createTestChainProduct(1, 1, 2).pipe(ce('### ChainProduct SEED 02')),
          createTestChainProduct(1, 2, 3).pipe(ce('### ChainProduct SEED 03')),
          createTestGroupProduct(1, 1, 1, 1).pipe(ce('### GroupProd SEED 01')),
          createTestGroupProduct(1, 1, 2, 2).pipe(ce('### GroupProd SEED 02')),
          createTestUnitProduct(1, 1, 1, 1, 1).pipe(ce('### UnitProd SEED 01')),
          createTestUnitProduct(1, 1, 1, 2, 2).pipe(ce('### UnitProd SEED 02')),
          createTestCart({
            chainIdx: 1,
            groupIdx: 1,
            unitIdx: 1,
            productIdx: 1,
            userIdx: 1,
            cartIdx: 1,
          }),
        ]),
      ),
      delay(2000),
      switchMap(() =>
        deleteTestAdminRoleContext(1).pipe(
          ce('### ADMIN_ROLE_CONTEXT SEED DELETE'),
        ),
      ),
      delay(2000),
      switchMap(() =>
        createTestAdminRoleContext(1, 1, userId).pipe(
          ce('### ADMIN_ROLE_CONTEXT SEED CREATE'),
        ),
      ),
    )
    .pipe(ce('### seedBusinessData'));

const ce = (tag: string) =>
  catchError(err => {
    console.error(`[${tag}: Error]`, JSON.stringify(err, undefined, 2));
    throw err;
  });
