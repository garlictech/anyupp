import * as CrudApi from '@bgap/crud-gql/api';
import {
  createAdminUser as resolverCreateAdminUser,
  ResolverErrorCode,
  unitRequestHandler,
} from '@bgap/anyupp-gql/backend';
import * as R from 'ramda';
import {
  otherAdminEmails,
  testAdminEmail,
  testAdminUserPassword,
  unitFixture,
} from '@bgap/shared/fixtures';
import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import { combineLatest, concat, defer, from, of, throwError } from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  map,
  switchMap,
  takeLast,
  tap,
  toArray,
} from 'rxjs/operators';
import {
  createAdminUser,
  createComponentSets,
  createTestAdminRoleContext,
  createTestChain,
  createTestChainProduct,
  createTestGroup,
  createTestGroupProduct,
  createTestOrder,
  createTestProductCategory,
  createTestRoleContext,
  createTestUnit,
  createTestUnitProduct,
  SeederDependencies,
} from './seed-data-fn';

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
      takeLast(1), // THIS takeLast is important to not trigger the seed creation multiple times
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
          createTestOrder({
            chainIdx: 1,
            groupIdx: 1,
            unitIdx: 1,
            productIdx: 1,
            userIdx: 1,
            orderIdx: 1,
          })(deps),
        ),
      ),
      toArray(),
    )
    .pipe(ce('### seedBusinessData'));

const regenerateUnitDataForTheSeededUnits = (deps: SeederDependencies) =>
  of('start').pipe(
    switchMap(() =>
      defer(() =>
        unitRequestHandler({ crudSdk: deps.crudSdk }).regenerateUnitData({
          input: { id: unitFixture.unitId_seeded_01 },
        }),
      ),
    ),
  );

const seedLotsOfOrders = (deps: SeederDependencies) => {
  console.debug(`Creating a lot of test orders.`);

  return pipe(
    R.range(1, 200),
    R.map(
      (index): CrudApi.CreateOrderInput => ({
        userId: 'test-monad@anyupp.com',
        unitId: unitFixture.unitId_seeded_01,
        orderNum: `${index}`,
        items: [],
        paymentMode: {
          type: CrudApi.PaymentType.cash,
          method: CrudApi.PaymentMethod.cash,
        },
        statusLog: [],
        archived: !(index % 2),
        sumPriceShown: {
          currency: 'huf',
          pricePerUnit: 10.0,
          priceSum: 10.0,
          tax: 10,
          taxSum: 1,
        },
        takeAway: false,
      }),
    ),
    x => from(x),
  ).pipe(
    concatMap(input => deps.crudSdk.CreateOrder({ input })),
    toArray(),
    tap(objects => console.debug(`Created ${objects?.length} test orders.`)),
  );
};

const seedConsumerUser = (deps: SeederDependencies) => {
  console.debug(`Seeding a consumer user`);
  const Username = 'test-monad';

  return pipe(
    {
      Username,
      UserAttributes: [
        {
          Name: 'email',
          Value: 'test-monad@anyupp.com',
        },
        {
          Name: 'email_verified',
          Value: 'true',
        },
        {
          Name: 'name',
          Value: 'Gombóc Artúr',
        },
      ],
      UserPoolId: deps.consumerUserPoolId,
      DesiredDeliveryMediums: ['EMAIL'],
    },
    params =>
      defer(() =>
        from(
          deps.cognitoidentityserviceprovider.adminCreateUser(params).promise(),
        ),
      ),
  ).pipe(
    map(() => ({
      UserPoolId: deps.consumerUserPoolId,
      Username,
      Password: password,
      Permanent: true,
    })),
    switchMap(params =>
      defer(() =>
        deps.cognitoidentityserviceprovider
          .adminSetUserPassword(params)
          .promise(),
      ),
    ),
    catchError(err => {
      console.warn(
        'User cannot be created in the consumer pool, probably normal: ',
        err,
      );
      return of(true);
    }),
  );
};

export const seedAll = (deps: SeederDependencies) =>
  seedAdminUser(deps).pipe(
    switchMap(() => seedConsumerUser(deps)),
    delay(2000),
    switchMap(() => seedBusinessData(deps)),
    switchMap(() => seedLotsOfOrders(deps)),
    delay(2000),
    switchMap(() => regenerateUnitDataForTheSeededUnits(deps)),
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
