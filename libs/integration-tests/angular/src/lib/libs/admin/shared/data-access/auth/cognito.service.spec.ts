import { CognitoService } from '@bgap/admin/shared/data-access/auth';
import Amplify, { Auth } from 'aws-amplify';
import { awsConfig } from '@bgap/admin/amplify-api';
import {
  testAdminUsername,
  testAdminUserPassword,
} from '../../../../../common';
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';

Amplify.configure(awsConfig);

describe('Testing cognito service', () => {
  test('Test valid authorization', done => {
    const service = new CognitoService();

    service.currentContext = 'GOOD_CONTEXT';
    from(Auth.signIn(testAdminUsername, testAdminUserPassword))
      .pipe(tap(res => expect(res).toMatchSnapshot))
      .subscribe({
        next: done,
      });
  });
});
