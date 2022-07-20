import {
  getCognitoUsername,
  //orderFixture,
  otherAdminUsernames,
  testAdminUsername,
  testAdminUserPassword,
  //transactionFixture,
  unitFixture,
} from '@bgap/shared/fixtures';
import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';

import { combineLatest, concat, defer, from, of } from 'rxjs';
import {
  catchError,
  delay,
  map,
  switchMap,
  tap,
  toArray,
} from 'rxjs/operators';
import {
  createAdminUser,
  createComponentSets,
  createConsumerUser,
  createTestChain,
  createTestGroup,
  createTestUnit,
  createTestUnitsForOrderHandling,
  SeederDependencies,
  seedYellowRKeeperUnit,
  seedSportbarRKeeperUnit,
  createChainProductsFromSnapshot,
  createGroupProductsFromSnapshot,
  createTestProductCategoryFromFixtures,
  createUnitProductsFromSnapshot,
  //placeOrderToSeat,
  //seedLotsOfOrders,
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

export const seedAdminUser = (deps: SeederDependencies) =>
  pipe(
    userData.map(({ email, username, phone }) =>
      createAdminUser(
        username,
        email,
        phone,
      )(deps).pipe(
        switchMap(() =>
          from(
            deps.cognitoidentityserviceprovider
              .adminSetUserPassword({
                UserPoolId: deps.userPoolId,
                Username: username,
                Password: password,
                Permanent: true,
              })
              .promise(),
          ),
        ),
        tap(() => console.log('USER PASSWORD SET', username)),
      ),
    ),
    combineLatest,
  );

export const seedBusinessData = (deps: SeederDependencies) =>
  of(1)
    .pipe(
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
          createTestUnitsForOrderHandling()(deps).pipe(
            ce('### Order handling units'),
          ),
          createTestProductCategoryFromFixtures()(deps),
          createComponentSets(deps).pipe(ce('### ComponentSets')),
          createChainProductsFromSnapshot(deps).pipe(ce('### Chain products')),
          createGroupProductsFromSnapshot(deps).pipe(ce('### Group products')),
          createUnitProductsFromSnapshot(deps).pipe(ce('### Unit products')),
        ),
      ),
      toArray(),
    )
    .pipe(ce('### seedBusinessData'));

const regenerateUnitDataForTheSeededUnits = (deps: SeederDependencies) =>
  of('start').pipe(
    switchMap(() =>
      deps.crudSdk.RegenerateUnitData({
        input: { id: unitFixture.unitId_seeded_01 },
      }),
    ),
  );

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
      from(
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
    switchMap(() => seedYellowRKeeperUnit(deps)),
    switchMap(() => seedSportbarRKeeperUnit(deps)),
  );
