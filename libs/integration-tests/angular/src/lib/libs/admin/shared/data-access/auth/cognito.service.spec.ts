import { CognitoService } from '@bgap/admin/shared/data-access/auth';
import { Auth, CognitoUser } from '@aws-amplify/auth';
import { from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { configureAmplifyWithUserPasswordAuthFlow } from '@bgap/shared/graphql/api-client';
import {
  testAdminUsername,
  testAdminUserPassword,
} from '@bgap/integration-tests/universal';

describe('Testing cognito service', () => {
  const service = new CognitoService();
  const goodContext = 'cmd46v'; // TODO seeeded data
  // const goodContext = 'GOOD_CONTEXT';
  const badContext = 'BAD_CONTEXT';

  beforeAll(() => {
    configureAmplifyWithUserPasswordAuthFlow();
  });

  test.only('Test valid authorization', done => {
    service.currentContext = goodContext;

    from(Auth.signIn(testAdminUsername, testAdminUserPassword))
      .pipe(
        switchMap(() => service.handleContext()),
        switchMap(() => from(Auth.currentAuthenticatedUser())),
        tap((auth: CognitoUser) => {
          const token = auth?.getSignInUserSession()?.getIdToken();
          const decoded = token?.decodePayload();
          expect(decoded?.role).toEqual('superuser');
          expect(decoded?.['custom:context']).toEqual(goodContext);
        }),
      )
      .subscribe(() => done());
  });

  test('Test invalid authorization', done => {
    service.currentContext = badContext;

    from(Auth.signIn(testAdminUsername, testAdminUserPassword))
      .pipe(
        switchMap(() => service.handleContext()),
        switchMap(() => from(Auth.currentAuthenticatedUser())),
        tap((auth: CognitoUser) => {
          const token = auth?.getSignInUserSession()?.getIdToken();
          const decoded = token?.decodePayload();
          expect(decoded?.groupId).toBeUndefined();
          expect(decoded?.chainId).toBeUndefined();
          expect(decoded?.['custom:context']).toEqual('');
        }),
      )
      .subscribe(() => done());
  });

});
