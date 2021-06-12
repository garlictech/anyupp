import {
  otherAdminEmails,
  testAdminEmail,
  testAdminUserPassword,
} from '@bgap/shared/fixtures';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import { combineLatest, concat, defer, from, of, throwError } from 'rxjs';
import {
  catchError,
  delay,
  map,
  mapTo,
  mergeMap,
  switchMap,
  takeLast,
  tap,
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
  createAdminUser,
  SeederDependencies,
  createComponentSets,
} from './seed-data-fn';
import { throwIfEmptyValue } from '@bgap/shared/utils';
import { v1 as uuidV1 } from 'uuid';

const userData = pipe(
  [testAdminEmail, ...otherAdminEmails],
  fp.map(email => ({ email, username: uuidV1() })),
);

const password = testAdminUserPassword;

export const seedAdminUser = (deps: SeederDependencies) =>
  pipe(
    userData.map(({ email }) => ({
      UserPoolId: deps.userPoolId,
      Username: uuidV1(),
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
      ],
    })),
    fp.map(params =>
      defer(() =>
        deps.cognitoidentityserviceprovider.adminCreateUser(params).promise(),
      ).pipe(
        tap(() => console.log('USER CREATED', params)),
        catchError(err => {
          if (err?.code === 'UsernameExistsException') {
            console.warn(
              `Admin user ${params.UserAttributes[0].Value} in Cognito already exists, no problem`,
            );
            return of({});
          } else {
            return throwError(err);
          }
        }),
      ),
    ),
    combineLatest,
    tap(x => console.log(x)),
    switchMap(() =>
      pipe(
        userData.map(({ username }) => ({
          UserPoolId: deps.userPoolId,
          Username: username,
          Password: password,
          Permanent: true,
        })),

        fp.map(params =>
          defer(() =>
            deps.cognitoidentityserviceprovider
              .adminSetUserPassword(params)
              .promise(),
          ).pipe(tap(() => console.log('USER PASSWORD SET', params))),
        ),
        combineLatest,
      ),
    ),
    switchMap(() =>
      pipe(
        userData.map(({ username, email }) =>
          createAdminUser(
            username,
            email,
          )(deps).pipe(
            tap(() => console.log('USER CREATED in DB', username, email)),
          ),
        ),
        combineLatest,
      ),
    ),
  );

export const seedBusinessData = (userId: string) => (
  deps: SeederDependencies,
) =>
  createTestRoleContext(
    1,
    1,
    1,
    1,
  )(deps)
    .pipe(
      ce('### RoleContext SEED 01'),
      takeLast(1),
      delay(1000),
      switchMap(() =>
        concat(
          createTestChain(1)(deps).pipe(ce('### Chain SEED 01')),
          createTestGroup(1, 1)(deps).pipe(ce('### Group SEED 01')),
          createTestGroup(1, 2)(deps).pipe(ce('### Group SEED 02')),
          createTestGroup(2, 1)(deps).pipe(ce('### Group SEED 03')),
          createTestUnit(1, 1, 1)(deps).pipe(ce('### Unit SEED 01')),
          createTestUnit(1, 1, 2)(deps).pipe(ce('### Unit SEED 02')),
          createTestUnit(1, 2, 1)(deps).pipe(ce('### Unit SEED 03')),
          createTestProductCategory(1, 1)(deps).pipe(ce('### ProdCat SEED 01')),
          createTestProductCategory(1, 2)(deps).pipe(ce('### ProdCat SEED 02')),

          createComponentSets(deps).pipe(ce('### ComponentSets')),

          createTestChainProduct(
            1,
            1,
            1,
          )(deps).pipe(ce('### ChainProduct SEED 01')),
          createTestChainProduct(
            1,
            1,
            2,
          )(deps).pipe(ce('### ChainProduct SEED 02')),
          createTestChainProduct(
            1,
            2,
            3,
          )(deps).pipe(ce('### ChainProduct SEED 03')),
          createTestGroupProduct(
            1,
            1,
            1,
            1,
          )(deps).pipe(ce('### GroupProd SEED 01')),
          createTestGroupProduct(
            1,
            1,
            2,
            2,
          )(deps).pipe(ce('### GroupProd SEED 02')),
          createTestUnitProduct(
            1,
            1,
            1,
            1,
            1,
          )(deps).pipe(ce('### UnitProd SEED 01')),
          createTestUnitProduct(
            1,
            1,
            1,
            2,
            2,
          )(deps).pipe(ce('### UnitProd SEED 02')),
          createTestCart({
            chainIdx: 1,
            groupIdx: 1,
            unitIdx: 1,
            productIdx: 1,
            userIdx: 1,
            cartIdx: 1,
          })(deps),
        ),
      ),
      takeLast(1),
      switchMap(() =>
        createTestAdminRoleContext(
          1,
          1,
          userId,
        )(deps).pipe(ce('### ADMIN_ROLE_CONTEXT SEED CREATE')),
      ),
    )
    .pipe(ce('### seedBusinessData'));

const ce = (tag: string) =>
  catchError(err => {
    console.error(`[${tag}: Error]`, JSON.stringify(err, undefined, 2));
    throw err;
  });
