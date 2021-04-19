import { AWSError, CognitoIdentityServiceProvider } from 'aws-sdk';
import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import { combineLatest, from, of, throwError } from 'rxjs';
import { catchError, filter, map, mapTo, switchMap } from 'rxjs/operators';

import API, { graphqlOperation } from '@aws-amplify/api-graphql';
import Amplify from '@aws-amplify/core';
import {
  awsConfig,
  CrudApi,
  CrudApiMutationDocuments,
} from '@bgap/crud-gql/api';
import { pipeDebug as pd } from '@bgap/shared/utils';

import {
  createTestCart,
  createTestChain,
  createTestChainProduct,
  createTestGroup,
  createTestGroupProduct,
  createTestProductCategory,
  createTestUnit,
  createTestUnitProduct,
} from './seed-data-fn';

Amplify.configure(awsConfig);

const username = 'test@anyupp.com';
const password = 'Testtesttest12_';

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'eu-west-1',
});

export const seedAdminUser = (UserPoolId: string) =>
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
          console.warn('Probably normal error: ', err);
          return of({});
        }),
      ),
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
    map((user: CognitoIdentityServiceProvider.Types.AdminGetUserResponse) =>
      pipe(
        user.UserAttributes,
        fp.find(attr => attr.Name === 'sub'),
        attr => attr?.Value,
      ),
    ),
    filter(fp.negate(fp.isEmpty)),
    map((adminUserId: string) => ({
      id: adminUserId,
      name: 'John Doe',
      email: 'john@doe.com',
      phone: '123123213',
      profileImage:
        'https://ocdn.eu/pulscms-transforms/1/-rxktkpTURBXy9jMzIxNGM4NWI2NmEzYTAzMjkwMTQ1NGMwZmQ1MDE3ZS5wbmeSlQMAAM0DFM0Bu5UCzQSwAMLD',
    })),
    switchMap((input: CrudApi.CreateAdminUserInput) =>
      pipe(
        API.graphql(
          graphqlOperation(CrudApiMutationDocuments.createAdminUser, {
            input,
          }),
        ),
        operation =>
          operation instanceof Promise
            ? from(operation)
            : throwError('Wrong graphql operation'),
      ),
    ),
    mapTo('SUCCESS'),
    catchError((error: AWSError) => {
      console.log("Probably 'normal' error: ", error);
      return error.code === 'UsernameExistsException'
        ? of('SUCCESS')
        : throwError(error);
    }),
  );

export const seedBusinessData = () =>
  pipe(
    combineLatest([
      createTestChain(1).pipe(pd('### Chain SEED 01')),
      createTestGroup(1, 1).pipe(pd('### Group SEED 01')),
      createTestGroup(1, 2).pipe(pd('### Group SEED 02')),
      createTestGroup(2, 1).pipe(pd('### Group SEED 03')),
      createTestUnit(1, 1, 1).pipe(pd('### Unit SEED 01')),
      createTestUnit(1, 1, 2).pipe(pd('### Unit SEED 02')),
      createTestUnit(1, 2, 1).pipe(pd('### Unit SEED 03')),
      createTestProductCategory(1, 1).pipe(pd('### ProdCat SEED 01')),
      createTestProductCategory(1, 2).pipe(pd('### ProdCat SEED 02')),
      createTestChainProduct(1, 1, 1).pipe(pd('### ChainProduct SEED 01')),
      createTestChainProduct(1, 1, 2).pipe(pd('### ChainProduct SEED 02')),
      createTestChainProduct(1, 2, 3).pipe(pd('### ChainProduct SEED 03')),
      createTestGroupProduct(1, 1, 1, 1).pipe(pd('### GroupProd SEED 01')),
      createTestGroupProduct(1, 1, 2, 2).pipe(pd('### GroupProd SEED 02')),
      createTestUnitProduct(1, 1, 1, 1, 1).pipe(pd('### UnitProd SEED 01')),
      createTestUnitProduct(1, 1, 1, 2, 2).pipe(pd('### UnitProd SEED 02')),
      createTestCart({
        chainIdx: 1,
        groupIdx: 1,
        unitIdx: 1,
        productIdx: 1,
        userIdx: 1,
        cartIdx: 1,
      }).pipe(pd('### Cart SEED')),
    ]),
  );
