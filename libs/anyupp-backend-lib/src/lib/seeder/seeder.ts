import { tableConfig } from '@bgap/crud-gql/backend';
import {
  createAdminUser as resolverCreateAdminUser,
  ResolverErrorCode,
  unitRequestHandler,
} from '@bgap/anyupp-gql/backend';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  getCognitoUsername,
  orderFixture,
  otherAdminUsernames,
  seededIdPrefix,
  testAdminUsername,
  testAdminUserPassword,
  transactionFixture,
  unitFixture,
} from '@bgap/shared/fixtures';
import { EProductType } from '@bgap/shared/types';
import { DynamoDB } from 'aws-sdk';
import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import * as R from 'ramda';
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
  createConsumerUser,
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
  createTestUnitsForOrderHandling,
  SeederDependencies,
} from './seed-data-fn';

const ce = (tag: string) =>
  catchError(err => {
    console.error(`[${tag}: Error]`, JSON.stringify(err, undefined, 2));
    throw err;
  });

const userData = pipe(
  [testAdminUsername, ...otherAdminUsernames],
  fp.map(getCognitoUsername),
  userNames =>
    userNames.map((username, index) => ({
      email: `${username}@anyupp.com`,
      username,
      phone: `+123456789${index}`,
    })),
);

const password = testAdminUserPassword;
const docClient = new DynamoDB.DocumentClient();

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
                  name: username,
                  phone,
                  email,
                },
              })({
                ...deps,
                userNameGenerator: () => username,
                docClient,
                adminUserTableName: tableConfig.AdminUser.TableName,
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
          createConsumerUser()(deps).pipe(ce('### Consumer user')),
          createTestChain(1)(deps).pipe(ce('### Chain SEED 01')),
          createTestGroup(1, 1)(deps).pipe(ce('### Group SEED 01')),
          createTestGroup(1, 2)(deps).pipe(ce('### Group SEED 02')),
          createTestGroup(2, 1)(deps).pipe(ce('### Group SEED 03')),
          createTestUnit(1, 1, 1)(deps).pipe(ce('### Unit SEED 01')),
          createTestUnit(1, 1, 2)(deps).pipe(ce('### Unit SEED 02')),
          createTestUnit(1, 2, 1)(deps).pipe(ce('### Unit SEED 03')),
          createTestUnit(1, 2, 1)(deps).pipe(ce('### Unit SEED 03')),
          createTestUnit(1, 2, 1)(deps).pipe(ce('### Unit SEED 03')),
          createTestUnit(1, 2, 1)(deps).pipe(ce('### Unit SEED 03')),
          createTestUnit(1, 2, 1)(deps).pipe(ce('### Unit SEED 03')),
          createTestUnitsForOrderHandling()(deps).pipe(
            ce('### Order handling units'),
          ),
          createTestProductCategory(1, 1)(deps).pipe(ce('### ProdCat SEED 01')),
          createTestProductCategory(1, 2)(deps).pipe(ce('### ProdCat SEED 02')),
          createComponentSets(deps).pipe(ce('### ComponentSets')),
          createTestChainProduct(
            1,
            1,
            1,
            'Hamburger',
            EProductType.FOOD,
          )(deps).pipe(ce('### ChainProduct SEED 01')),
          createTestChainProduct(
            1,
            1,
            2,
            'Fanta',
            EProductType.DRINK,
          )(deps).pipe(ce('### ChainProduct SEED 02')),
          createTestChainProduct(
            1,
            2,
            3,
            'Hamburger',
            EProductType.FOOD,
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
        unitRequestHandler({
          crudSdk: deps.crudSdk,
          hashGenerator: (password: string) => `HASHED ${password}`,
          uuidGenerator: () => unitFixture.unitId_seeded_01,
          docClient: new DynamoDB.DocumentClient(),
          tableName: tableConfig.Unit.TableName,
        }).regenerateUnitData({
          input: { id: unitFixture.unitId_seeded_01 },
        }),
      ),
    ),
  );

interface BulkOrderInput {
  order: CrudApi.CreateOrderInput;
  transaction: CrudApi.CreateTransactionInput;
}

const seedLotsOfOrders = (
  deps: SeederDependencies,
  idxBase: number,
  range: number,
  orderInput: CrudApi.CreateOrderInput,
  transactionInput: CrudApi.CreateTransactionInput,
) => {
  console.debug(`Creating a lot of test orders (${range}).`);

  return pipe(
    R.range(1, range + 1),
    R.map((index): BulkOrderInput => {
      const orderId = `${seededIdPrefix}order_id_${idxBase + index}`;
      const transactionId = `${seededIdPrefix}transaction_id_${
        idxBase + index
      }`;

      return {
        order: {
          ...orderInput,
          id: orderId,
          transactionId,
          orderNum: index.toString().padStart(6, '0'),
        },
        transaction: {
          ...transactionInput,
          id: transactionId,
          orderId,
        },
      };
    }),
    x => from(x),
  ).pipe(
    concatMap((input: BulkOrderInput) =>
      of('magic').pipe(
        switchMap(() =>
          deps.crudSdk.CreateTransaction({ input: input.transaction }),
        ),
        switchMap(() => deps.crudSdk.CreateOrder({ input: input.order })),
      ),
    ),
    toArray(),
    tap(objects => console.debug(`Created ${objects?.length} test orders.`)),
  );
};

interface ConsumerUser {
  username: string;
  email: string;
  emailVerified: string;
  name: string;
}

const seedConsumerUser = (deps: SeederDependencies, userData: ConsumerUser) => {
  console.debug(`Seeding a consumer user`);

  return pipe(
    {
      Username: userData.username,
      UserAttributes: [
        {
          Name: 'email',
          Value: userData.email,
        },
        {
          Name: 'email_verified',
          Value: userData.emailVerified,
        },
        {
          Name: 'name',
          Value: userData.name,
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
      Username: userData.username,
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
    switchMap(() =>
      seedConsumerUser(deps, {
        username: 'test-monad',
        email: 'testuser+monad@anyupp.com',
        emailVerified: 'true',
        name: 'Gombóc Artúr',
      }),
    ),
    switchMap(() =>
      seedConsumerUser(deps, {
        username: 'test-alice',
        email: 'testuser+alice@anyupp.com',
        emailVerified: 'true',
        name: 'Mekk Elek',
      }),
    ),
    delay(2000),
    switchMap(() => seedBusinessData(deps)),
    delay(2000),
    switchMap(() =>
      seedLotsOfOrders(
        deps,
        0,
        10,
        orderFixture.activeWaitingCardOrderInput,
        transactionFixture.waitingCardTransactionInput,
      ),
    ),
    switchMap(() =>
      seedLotsOfOrders(
        deps,
        10,
        10,
        orderFixture.activeWaitingCashOrderInput,
        transactionFixture.waitingCashTransactionInput,
      ),
    ),
    delay(2000),
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
    delay(5000),
    switchMap(() => regenerateUnitDataForTheSeededUnits(deps)),
    catchError(() => of(true)),
  );
