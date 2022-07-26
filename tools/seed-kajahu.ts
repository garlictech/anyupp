//#########
// execute with:
// yarn ts-node --project ./tools/tsconfig.json -r tsconfig-paths/register ./tools/seed-kajahu.ts

import assert from 'assert';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import chalk from 'chalk';
import { defer, Observable } from 'rxjs';
import { map, mapTo, switchMap, tap } from 'rxjs/operators';

import {
  validateChain,
  validateGroup,
  validateUnit,
} from '@bgap/shared/data-validators';

import { createConfirmedUserInCognito } from '../libs/anyupp-gql/backend/src/lib/lambda-resolvers/user/utils';
import * as CrudApi from '../libs/crud-gql/api/src';

const EMAIL = 'anyupp-admin@anyupp.com';
const PASSWORD = 'Hideghegy12_';
ł;
const USER_NAME = 'megafirstsuperuser';
const CONTEXT = 'SU_CTX_ID';
const NAME = 'KAJAHU_ADMIN_USER';
const PHONE = '123123213';

const UNIT_ID = '-MGMw7p0gQsX31ZLZOkK';

const chainInput: CrudApi.CreateChainInput = {
  address: {
    country: 'Hungary',
    location: {
      lng: 19.0503706,
      lat: 47.4974623,
    },
    address: 'József nádor tér 5-6 fszt 1',
    title: 'CyBERG HQ',
    city: 'Budapest',
    postalCode: '1051',
  },
  description: {
    de: 'CYBERG Anyupp HQ',
    en: 'CYBERG Anyupp HQ',
    hu: 'Welcome to AnyUpp HQ',
  },
  isActive: true,
  email: 'anyupp@cyberg.net',
  name: 'Cyberg Corp Nyrt',
  phone: '+36203324200',
  style: {
    images: {
      header: 'chains/yplep0rnve2kmosc.png',
      logo: 'chains/066fhc84fbfi1126.png',
    },
    colors: {
      indicator: '#30bf60',
      highlight: '#a8692a',
      textDark: '#303030',
      backgroundDark: '#d6dde0',
      disabled: '#303030',
      backgroundLight: '#ffffff',
      borderLight: '#e7e5d0',
      borderDark: '#c3cacd',
      textLight: '#ffffff',
      primary: '#30bf60', // indicator
      secondary: '#303030', // textDark
    },
  },
};
const groupInput: CrudApi.CreateGroupInput = {
  chainId: 'SHOULD_BE_UPDATED_DURING_CREATION',
  currency: 'HUF',
  address: {
    country: 'Hungary',
    location: {
      lng: 19.0503706,
      lat: 47.4974623,
    },
    address: 'József nádor tér 5-6',
    title: 'ANYUPP RDC',
    city: 'Budapest',
    postalCode: '1051',
  },
  description: {
    de: 'AnyuUpp R&D Centre',
    en: 'AnyuUpp R&D Centre',
    hu: 'AnyuUpp R&D Centre',
  },
  email: 'admin@anyupp.com',
  phone: '+36203324200',
  name: 'ANYUPP R&D Centre',
};
const unitInput: CrudApi.CreateUnitInput = {
  id: UNIT_ID,
  chainId: 'SHOULD_BE_UPDATED_DURING_CREATION',
  groupId: 'SHOULD_BE_UPDATED_DURING_CREATION',
  openingHours: {
    thu: {
      from: '09:00',
      to: '18:00',
    },
    tue: {
      from: '09:00',
      to: '18:00',
    },
    wed: {
      from: '09:00',
      to: '18:00',
    },
    sat: {
      from: '',
      to: '',
    },
    custom: [],
    fri: {
      from: '09:00',
      to: '18:00',
    },
    mon: {
      from: '09:00',
      to: '18:00',
    },
    sun: {
      from: '',
      to: '',
    },
  },
  open: {
    from: '2021-06-02',
    to: '2021-12-31',
  },
  address: {
    country: 'Hungary',
    location: {
      lng: 19.0763101,
      lat: 47.485722,
    },
    address: 'Corvin sétány 3',
    title: 'KAJAHU Corvin',
    city: 'Budapest',
    postalCode: '1081',
  },
  email: 'admin@anyupp.com',
  name: 'KAJAHU CORVIN',
  paymentModes: [
    {
      method: CrudApi.PaymentMethod.cash,
      type: CrudApi.PaymentType.cash,
    },
    {
      method: CrudApi.PaymentMethod.card,
      type: CrudApi.PaymentType.card,
    },
    {
      method: CrudApi.PaymentMethod.inapp,
      type: CrudApi.PaymentType.stripe,
    },
  ],
  isActive: true,
  lanes: [
    {
      color: '#1043f1',
      name: 'pult',
      id: 'a493ed70-c39a-11eb-ae19-293a0a09bb23',
    },
    {
      color: '#f30b29',
      name: 'konyha',
      id: '013272d0-c39c-11eb-ae19-293a0a09bb23',
    },
  ],
  isAcceptingOrders: true,
  description: {
    de: 'KAJAHU CORVIN 3',
    en: 'KAJAHU CORVIN 3',
    hu: 'KAJAHU CORVIN 3',
  },
  phone: '+36203324200',
};

const awsAccesskeyId = process.env.AWS_ACCESS_KEY_ID || '';
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
// const crudSdk = getCrudSdkForIAM(awsAccesskeyId, awsSecretAccessKey);
const crudSdk = CrudApi.getCrudSdkForIAM(awsAccesskeyId, awsSecretAccessKey);
const adminUserPoolId = awsConfig.aws_user_pools_id;
const adminUserPoolClientId = awsConfig.aws_user_pools_web_client_id;
const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: process.env.AWS_REGION || '',
});

console.log('EMAIL', chalk.yellowBright.bold(EMAIL));
console.log('PASSWORD', chalk.yellowBright.bold(PASSWORD));
console.log('CONTEXT', chalk.yellowBright.bold(CONTEXT));
if (!EMAIL) {
  throw new Error('email param is missing');
}
if (!PASSWORD) {
  throw new Error('password param is missing');
}

const isAdminUserCanAuthenticate = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) =>
  defer(() =>
    cognitoidentityserviceprovider
      .initiateAuth({
        ClientId: adminUserPoolClientId,
        AuthFlow: 'USER_PASSWORD_AUTH',
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      })
      .promise(),
  ).pipe(
    tap({
      next(initiateAuthResponse) {
        assert(
          !!initiateAuthResponse.AuthenticationResult?.AccessToken,
          'AccessToken is missing',
        );
        assert(
          !!initiateAuthResponse.AuthenticationResult?.RefreshToken,
          'RefreshToken is missing',
        );
        assert(
          initiateAuthResponse.AuthenticationResult?.TokenType === 'Bearer',
          'TokenType is not Bearer',
        );
        console.log(chalk.greenBright.bold('ADMIN USER AUTH check is OK'));
      },
      error(err) {
        console.error(err);
        assert(false, 'THE USER LOGIN SHOULD NOT FAIL');
      },
    }),
  );

const createAndCheckAdminUser = () =>
  createConfirmedUserInCognito({
    cognitoidentityserviceprovider,
    userPoolId: adminUserPoolId,
  })({
    email: EMAIL,
    password: PASSWORD,
    name: NAME,
    username: USER_NAME,
  }).pipe(
    tap({
      next(newAdminUser) {
        assert(!!newAdminUser);
      },
    }),
    switchMap(() =>
      isAdminUserCanAuthenticate({ email: EMAIL, password: PASSWORD }),
    ),
    switchMap(() =>
      crudSdk
        .CreateAdminUser({
          input: {
            id: USER_NAME,
            email: EMAIL,
            name: NAME,
            phone: PHONE,
          },
        })
        .pipe(
          tap({
            next(newAdminUserDbRecord) {
              assert(!!newAdminUserDbRecord, 'User from db is missing');
              assert(
                !!newAdminUserDbRecord['id'] &&
                  newAdminUserDbRecord['id'] === USER_NAME,
                'UserId is not the same or missing',
              );
              assert(
                newAdminUserDbRecord['email'] === EMAIL,
                'Email from db is not the requested',
              );
              assert(
                newAdminUserDbRecord['name'] === NAME,
                'Name from db is not the requested',
              );
              console.log(
                chalk.greenBright.bold('ADMIN USER IN DB check is OK'),
              );
            },
            error() {
              console.log(chalk.redBright.bold('ADMIN USER create ERROR'));
            },
          }),
          mapTo(USER_NAME),
        ),
    ),
  );

const createAndCheckChainGroupUnit = (): Observable<{
  chainId: string;
  groupId: string;
  unitId: string;
}> =>
  // Create CHAIN
  crudSdk
    .CreateChain({
      input: chainInput,
    })
    .pipe(
      switchMap(validateChain),
      tap({
        next(newDbRecord: CrudApi.Chain) {
          assert(!!newDbRecord, 'Chain from db is missing');
          assert(!!newDbRecord['id'], 'Id is missing');
          assert(
            newDbRecord['email'] === chainInput.email,
            'Email from db is not the requested',
          );
          assert(
            newDbRecord['name'] === chainInput.name,
            'Name from db is not the requested',
          );
          console.log(chalk.greenBright.bold('CHAIN IN DB check is OK'));
        },
        error() {
          console.log(chalk.redBright.bold('CHAIN create ERROR'));
        },
      }),
      map((newDbRecord: CrudApi.Chain) => newDbRecord.id),

      // Create GROUP
      switchMap(chainId =>
        crudSdk
          .CreateGroup({
            input: {
              ...groupInput,
              chainId,
            },
          })
          .pipe(
            switchMap(validateGroup),
            tap({
              next(newDbRecord) {
                assert(!!newDbRecord, 'Group from db is missing');
                assert(!!newDbRecord['id'], 'Id is missing');
                assert(
                  newDbRecord['email'] === groupInput.email,
                  'Email from db is not the requested',
                );
                assert(
                  newDbRecord['phone'] === groupInput.phone,
                  'Phone from db is not the requested',
                );
                assert(
                  newDbRecord['currency'] === groupInput.currency,
                  'Currency from db is not the requested',
                );
                assert(
                  newDbRecord['chainId'] === chainId,
                  'ChainId from db is not the requested',
                );
                console.log(chalk.greenBright.bold('GROUP IN DB check is OK'));
              },
              error() {
                console.log(chalk.redBright.bold('GROUP create ERROR'));
              },
            }),

            map((newDbRecord: CrudApi.Group) => ({
              chainId,
              groupId: newDbRecord.id,
            })),
          ),
      ),

      // Create UNIT
      switchMap((props: { chainId: string; groupId: string }) =>
        crudSdk
          .CreateUnit({
            input: {
              ...unitInput,
              chainId: props.chainId,
              groupId: props.groupId,
            },
          })
          .pipe(
            switchMap(validateUnit),
            tap({
              next(newDbRecord) {
                assert(!!newDbRecord, 'Unit from db is missing');
                assert(!!newDbRecord['id'], 'Id is missing');
                assert(
                  newDbRecord['email'] === unitInput.email,
                  'Email from db is not the requested',
                );
                assert(
                  newDbRecord['phone'] === unitInput.phone,
                  'Phone from db is not the requested',
                );
                assert(
                  newDbRecord['chainId'] === props.chainId,
                  'ChainId from db is not the requested',
                );
                assert(
                  newDbRecord['groupId'] === props.groupId,
                  'GroupId from db is not the requested',
                );
                assert(
                  newDbRecord['id'] === UNIT_ID,
                  'UnitId from db is not the requested',
                );
                console.log(chalk.greenBright.bold('UNIT IN DB check is OK'));
                console.log(
                  chalk.greenBright.bold(`UNIT created with id ${UNIT_ID}`),
                );
              },
              error() {
                console.log(chalk.redBright.bold('UNIT create ERROR'));
              },
            }),
            map((newDbRecord: CrudApi.Unit) => ({
              ...props,
              unitId: newDbRecord.id,
            })),
          ),
      ),
    );

const createRoleContext = (adminUserId: string) => {
  const superuserInput: CrudApi.CreateRoleContextInput = {
    name: {
      hu: `Superuser role context - KajahuCorvin`,
      en: `Superuser role context - KajahuCorvin`,
    },
    role: CrudApi.Role.superuser,
    contextId: CONTEXT,
  };
  return crudSdk.CreateRoleContext({ input: superuserInput }).pipe(
    map(x => x as CrudApi.RoleContext),
    tap({
      next(newDbRecord: CrudApi.RoleContext) {
        assert(!!newDbRecord, 'RoleContext from db is missing');
        assert(!!newDbRecord['id'], 'Id is missing');
        assert(
          newDbRecord['role'] === CrudApi.Role.superuser,
          'Role from db is not the requested',
        );
        assert(
          newDbRecord['contextId'] === CONTEXT,
          'ContextId from db is not the requested',
        );
        console.log(chalk.greenBright.bold('ROLE_CONTEXT IN DB check is OK'));
      },
      error() {
        console.log(chalk.redBright.bold('ROLE CONTEXT create ERROR'));
      },
    }),
    map(newDbRecord => (newDbRecord as CrudApi.RoleContext).id),
    switchMap((roleContextId: string) =>
      crudSdk
        .CreateAdminRoleContext({
          input: {
            adminUserId,
            roleContextId,
          },
        })
        .pipe(
          map(x => x as CrudApi.AdminRoleContext),
          tap({
            next(newDbRecord: CrudApi.AdminRoleContext) {
              assert(!!newDbRecord, 'AdminRoleContext from db is missing');
              assert(!!newDbRecord['id'], 'Id is missing');
              assert(
                newDbRecord['adminUserId'] === adminUserId,
                'AdminUserId from db is not the requested',
              );
              assert(
                newDbRecord['roleContextId'] === roleContextId,
                'RoleContextId from db is not the requested',
              );
              console.log(
                chalk.greenBright.bold('ADMIN_ROLE_CONTEXT IN DB check is OK'),
              );
            },
            error() {
              console.log(
                chalk.redBright.bold('ADMIN ROLE CONTEXT create ERROR'),
              );
            },
          }),
        ),
    ),
  );
};

// *** EXECUTE ***
createAndCheckAdminUser()
  .pipe(
    switchMap(adminUserId => createRoleContext(adminUserId as string)),
    switchMap(() => crudSdk.DeleteUnit({ input: { id: UNIT_ID } })),
    switchMap(() => createAndCheckChainGroupUnit()),
  )
  .subscribe({
    next() {
      assert(true, 'SHOULD BE SUCCESSFULL');
    },
    error(err) {
      console.error(JSON.stringify(err, undefined, 2));
      console.log(chalk.redBright.bold('ERROR'));
      assert(false, 'THE WHOLE SCRIPT SHOULD NOT FAIL');
    },
  });
