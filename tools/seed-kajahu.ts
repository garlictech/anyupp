//#########
// execute with:
// yarn ts-node --project ./tools/tsconfig.tools.json -r tsconfig-paths/register ./tools/seed-kajahu.ts EMAIL PASSWORD

import chalk from 'chalk';
import { createConfirmedUserInCognito } from '../libs/anyupp-gql/backend/src/lib/lambda-resolvers/user/utils';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { awsConfig } from '../libs/crud-gql/api/src';
import { map, tap, switchMap } from 'rxjs/operators';
import assert from 'assert';
import { defer } from 'rxjs';
import * as CrudApi from '../libs/crud-gql/api/src';

const EMAIL = process.argv[2];
const PASSWORD = process.argv[3];
const NAME = 'KAJAHU_ADMIN_USER';
const PHONE = '123123213';
const awsAccesskeyId = 'AKIAYIT7GMY5WQZFXOOX'; // process.env.AWS_ACCESS_KEY_ID || '';
const awsSecretAccessKey = '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'; // process.env.AWS_SECRET_ACCESS_KEY || '';
// const anyuppSdk = getAnyuppSdkForIAM(awsAccesskeyId, awsSecretAccessKey);
const crudSdk = CrudApi.getCrudSdkForIAM(awsAccesskeyId, awsSecretAccessKey);
const adminUserPoolId = awsConfig.aws_user_pools_id;
const adminUserPoolClientId = awsConfig.aws_user_pools_web_client_id;
const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: process.env.AWS_REGION || '',
});

console.log('INPUT PARAMS EMAIL', chalk.yellowBright.bold(EMAIL));
console.log('INPUT PARAMS PASSWORD', chalk.yellowBright.bold(PASSWORD));
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
  })({ email: EMAIL, password: PASSWORD, name: NAME }).pipe(
    tap({
      next(newAdminUser) {
        assert(!!newAdminUser);
      },
    }),
    switchMap(props =>
      isAdminUserCanAuthenticate(props).pipe(map(() => props)),
    ),
    switchMap(props =>
      crudSdk
        .CreateAdminUser({
          input: {
            id: props.userId,
            email: props.email,
            name: props.name,
            phone: PHONE,
          },
        })
        .pipe(
          tap({
            next(newAdminUserDbRecord) {
              assert(!!newAdminUserDbRecord, 'User from db is missing');
              assert(
                !!newAdminUserDbRecord['id'] &&
                  newAdminUserDbRecord['id'] === props.userId,
                'UserId is not the same or missing',
              );
              assert(
                newAdminUserDbRecord['email'] === props.email,
                'Email from db is not the requested',
              );
              assert(
                newAdminUserDbRecord['name'] === props.name,
                'Name from db is not the requested',
              );
              console.log(
                chalk.greenBright.bold('ADMIN USER IN DB check is OK'),
              );
            },
          }),
        ),
    ),
  );

// *** EXECUTE ***
createAndCheckAdminUser().subscribe({
  next() {
    assert(true, 'SHOULD BE SUCCESSFULL');
  },
  error(err) {
    console.error(err);
    assert(false, 'THE USER LOGIN SHOULD NOT FAIL');
  },
});
