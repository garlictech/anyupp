import {
  otherAdminEmails,
  testAdminEmail,
  testAdminUserPassword,
} from '@bgap/shared/fixtures';
import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import { combineLatest, concat, defer, from, of, throwError } from 'rxjs';
import { catchError, delay, switchMap, tap, toArray } from 'rxjs/operators';
import {
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
  createTestAdminRoleContext,
} from './seed-data-fn';
import {
  createAdminUser as resolverCreateAdminUser,
  ResolverErrorCode,
} from '@bgap/anyupp-gql/backend';

const ce = (tag: string) =>
  catchError(err => {
    console.error(`[${tag}: Error]`, JSON.stringify(err, undefined, 2));
    throw err;
  });

const userData = pipe([testAdminEmail, ...otherAdminEmails], emails =>
  emails.map((email, index) => ({
    email,
    username: email.split('@')[0],
    phone: `+123456789${index}`,
  })),
);

const password = testAdminUserPassword;

export const seedAdminUser = (deps: SeederDependencies) =>
  pipe(
    userData.map(({ email, username, phone }) =>
      deps.crudSdk.DeleteAdminUser({ input: { id: username } }).pipe(
        catchError(err => {
          console.warn(
            `Temporarily ignored error during admin user deletion: ${err}`,
          );
          return of({});
        }),
        switchMap(() =>
          defer(() =>
            from(
              resolverCreateAdminUser({
                input: {
                  name: email.split('@')[0],
                  phone,
                  email,
                },
              })({
                ...deps,
                userNameGenerator: () => email.split('@')[0],
              }),
            ),
          ),
        ),
        catchError(err => {
          if (err.code === ResolverErrorCode.UserAlreadyExists) {
            console.warn(`${email} user already exists, no problem...`);
            return of({});
          }

          return throwError(err);
        }),
      ),
    ),
    combineLatest,
    switchMap(() =>
      pipe(
        userData.map(({ username }) => ({
          UserPoolId: deps.userPoolId,
          Username: username,
          Password: password,
          Permanent: true,
        })),

        fp.map(params => [
          defer(() =>
            deps.cognitoidentityserviceprovider
              .adminSetUserPassword(params)
              .promise(),
          ).pipe(tap(() => console.log('USER PASSWORD SET', params))),

          defer(() =>
            deps.cognitoidentityserviceprovider
              .adminUpdateUserAttributes({
                UserPoolId: deps.userPoolId,
                Username: params.Username,
                UserAttributes: [
                  {
                    Name: 'email_verified',
                    Value: 'true',
                  },
                  {
                    Name: 'phone_number_verified',
                    Value: 'true',
                  },
                ],
              })
              .promise(),
          ).pipe(
            tap(() => console.log('USER EMAIL AND PHONE VERIFIED', params)),
          ),
        ]),
        fp.flatten,
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

export const seedBusinessData = (deps: SeederDependencies) =>
  createTestRoleContext(
    1,
    1,
    1,
    1,
  )(deps)
    .pipe(
      ce('### RoleContext SEED 01'),
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
      toArray(),
    )
    .pipe(ce('### seedBusinessData'));

export const seedAll = (deps: SeederDependencies) =>
  seedAdminUser(deps).pipe(
    delay(2000),
    switchMap(() => seedBusinessData(deps)),
    switchMap(() =>
      combineLatest(
        userData.map(({ username }) =>
          createTestAdminRoleContext(
            1,
            1,
            username.split('@')[0],
          )(deps).pipe(ce('### ADMIN_ROLE_CONTEXT SEED CREATE')),
        ),
      ),
    ),
  );
