import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import { concat, from, Observable, of } from 'rxjs';
import { catchError, filter, map, mapTo, switchMap, tap } from 'rxjs/operators';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  executeMutation,
  GraphqlApiClient,
} from '@bgap/shared/graphql/api-client';
import { pipeDebug as pd } from '@bgap/shared/utils';

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
  SeederDeps,
} from './seed-data-fn';

const username = 'test@anyupp.com';
const password = 'Testtesttest12_';

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: process.env.AWS_REGION || '',
});

export const seedAdminUser = (UserPoolId: string) => ({
  crudBackendGraphQLClient,
}: {
  crudBackendGraphQLClient: GraphqlApiClient;
}): Observable<string> =>
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
      email: 'john@doe.com',
      phone: '123123213',
      profileImage:
        'https://ocdn.eu/pulscms-transforms/1/-rxktkpTURBXy9jMzIxNGM4NWI2NmEzYTAzMjkwMTQ1NGMwZmQ1MDE3ZS5wbmeSlQMAAM0DFM0Bu5UCzQSwAMLD',
    })),
    // pipeDebug('### User TO SAVE in Admin user table'),
    switchMap((input: CrudApi.CreateAdminUserInput) =>
      executeMutation(CrudApi.createAdminUser, 'createAdminUser', { input })(
        crudBackendGraphQLClient,
      ).pipe(
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
  );

export const seedBusinessData = (userId: string) => (deps: SeederDeps) =>
  concat(
    concat(
      createTestRoleContext(1, 1, 1, 1).pipe(pd('### RoleContext SEED 01')),
      createTestChain(1)(deps).pipe(pd('### Chain SEED 01')),
      createTestGroup(1, 1)(deps).pipe(pd('### Group SEED 01')),
      createTestGroup(1, 2)(deps).pipe(pd('### Group SEED 02')),
      createTestGroup(2, 1)(deps).pipe(pd('### Group SEED 03')),
      createTestUnit(1, 1, 1)(deps).pipe(pd('### Unit SEED 01')),
      createTestUnit(1, 1, 2)(deps).pipe(pd('### Unit SEED 02')),
      createTestUnit(1, 2, 1)(deps).pipe(pd('### Unit SEED 03')),
      createTestProductCategory(1, 1)(deps).pipe(pd('### ProdCat SEED 01')),
      createTestProductCategory(1, 2)(deps).pipe(pd('### ProdCat SEED 02')),
      createTestChainProduct(
        1,
        1,
        1,
      )(deps).pipe(pd('### ChainProduct SEED 01')),
      createTestChainProduct(
        1,
        1,
        2,
      )(deps).pipe(pd('### ChainProduct SEED 02')),
      createTestChainProduct(
        1,
        2,
        3,
      )(deps).pipe(pd('### ChainProduct SEED 03')),
      createTestGroupProduct(
        1,
        1,
        1,
        1,
      )(deps).pipe(pd('### GroupProd SEED 01')),
      createTestGroupProduct(
        1,
        1,
        2,
        2,
      )(deps).pipe(pd('### GroupProd SEED 02')),
      createTestUnitProduct(
        1,
        1,
        1,
        1,
        1,
      )(deps).pipe(pd('### UnitProd SEED 01')),
      createTestUnitProduct(
        1,
        1,
        1,
        2,
        2,
      )(deps).pipe(pd('### UnitProd SEED 02')),
      createTestCart({
        chainIdx: 1,
        groupIdx: 1,
        unitIdx: 1,
        productIdx: 1,
        userIdx: 1,
        cartIdx: 1,
      }),
    ),
    deleteTestAdminRoleContext(1)(deps).pipe(
      pd('### ADMIN_ROLE_CONTEXT SEED DELETE'),
    ),
    createTestAdminRoleContext(
      1,
      1,
      userId,
    )(deps).pipe(pd('### ADMIN_ROLE_CONTEXT SEED CREATE')),
  ).pipe(tap(x => console.log('seedBusinessData emitted: ', x)));
