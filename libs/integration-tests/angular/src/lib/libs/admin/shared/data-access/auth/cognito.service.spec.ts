import { CognitoService } from '@bgap/admin/shared/data-access/auth';
import { Auth, CognitoUser } from '@aws-amplify/auth';
import { from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import {
  getCognitoUsername,
  testAdminUsername,
  testAdminUserPassword,
} from '@bgap/shared/fixtures';
import { awsConfig } from '@bgap/crud-gql/api';

describe('Testing cognito service', () => {
  const router = {
    navigate: jest.fn(),
  };
  const zone = {
    run: jest.fn(),
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const service = new CognitoService(<any>router, <any>zone);

  const goodContext = 'SU_CTX_ID';
  const badContext = 'BAD_CONTEXT';

  beforeAll(() => {
    Auth.configure({
      ...awsConfig,
      // See: https://github.com/aws-amplify/amplify-js/issues/6552#issuecomment-682259256
      authenticationFlowType: 'USER_PASSWORD_AUTH',
      aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
    });
  });

  test.only('Test valid authorization', done => {
    service.currentContext = goodContext;

    from(
      Auth.signIn(getCognitoUsername(testAdminUsername), testAdminUserPassword),
    )
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
  }, 25000);

  afterAll(async () => {
    await Auth.signOut();
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
  }, 25000);
});
