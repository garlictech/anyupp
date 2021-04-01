import { awsConfig } from '@bgap/admin/amplify-api';
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import * as fp from 'lodash/fp';

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'eu-west-1',
});

const username = 'test@anyupp.com';

// TODO add test to find the user in the DB
describe('Testing backend seed state', () => {
  test('Test user must be present and we can log in', done => {
    from(
      cognitoidentityserviceprovider
        .adminGetUser({
          UserPoolId: awsConfig.aws_user_pools_id,
          Username: username,
        })
        .promise(),
    )
      .pipe(
        tap(result =>
          expect(fp.pick(['Enabled', 'UserStatus'], result)).toMatchSnapshot(),
        ),
      )
      .subscribe(() => done());
  }, 15000);
});
