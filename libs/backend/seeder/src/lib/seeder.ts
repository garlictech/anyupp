import {
  getCognitoUsername,
  //orderFixture,
  otherAdminUsernames,
  testAdminUsername,
  testAdminUserPassword,
  unitFixture,
} from '@bgap/shared/fixtures';
import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';

import { forkJoin, concat, defer, from, of } from 'rxjs';
import { catchError, map, switchMap, tap, toArray } from 'rxjs/operators';
import {
  createAdminUser,
  createComponentSets,
  createTestUnit,
  SeederDependencies,
  seedYellowRKeeperUnit,
  seedSportbarRKeeperUnit,
  createTestUnitProduct,
  createTestProductCategories,
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
    x => forkJoin(x),
  );

export const seedBusinessData = (deps: SeederDependencies) =>
  of(1)
    .pipe(
      switchMap(() =>
        concat(
          createTestUnit(deps),
          createTestProductCategories()(deps),
          createComponentSets(deps),
          createTestUnitProduct(unitFixture.kesdobalo.id)(deps),
        ),
      ),
      toArray(),
    )
    .pipe(ce('### seedBusinessData'));

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
    switchMap(() => seedBusinessData(deps)),
    switchMap(() => seedYellowRKeeperUnit(deps)),
    switchMap(() => seedSportbarRKeeperUnit(deps)),
  );
