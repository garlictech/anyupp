import { CognitoUser } from '@aws-amplify/auth';
import { Auth } from 'aws-amplify';
import awsConfig from '../../../../../libs/crud-gql/api/src/lib/generated/aws-exports';

Auth.configure(awsConfig);

// AWS Cognito
export const loginByCognitoApi = (
  username: string,
  password: string,
  context: string,
) => {
  const log = Cypress.log({
    displayName: 'COGNITO LOGIN',
    message: [`🔐 Authenticating | ${username} with ${context} context`],
    autoEnd: false,
  });

  log.snapshot('before');

  const signIn = Auth.signIn({ username, password });

  cy.wrap(signIn, { log: false, timeout: 10000 }).then(
    // The CognitoUser | any is the official return type :(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (cognitoResponse: CognitoUser | any) => {
      // CHECK required values in the response
      if (
        !cognitoResponse ||
        !cognitoResponse.keyPrefix ||
        !cognitoResponse.username ||
        !cognitoResponse.signInUserSession ||
        !cognitoResponse.signInUserSession.idToken?.jwtToken ||
        !cognitoResponse.signInUserSession.accessToken?.jwtToken ||
        !cognitoResponse.signInUserSession.refreshToken?.token ||
        cognitoResponse.signInUserSession.clockDrift === undefined
      ) {
        throw 'UNKNOWN Cognito authentication response!';
      }

      // SET CONTEXT
      const setContext = Auth.updateUserAttributes(cognitoResponse, {
        'custom:context': context,
      });

      return cy.wrap(setContext, { log: false, timeout: 10000 }).then(() => {
        const keyPrefixWithUsername = `${cognitoResponse.keyPrefix}.${cognitoResponse.username}`;

        cy.setLocalStorage(
          `${keyPrefixWithUsername}.idToken`,
          cognitoResponse.signInUserSession.idToken.jwtToken,
        );

        cy.setLocalStorage(
          `${keyPrefixWithUsername}.accessToken`,
          cognitoResponse.signInUserSession.accessToken.jwtToken,
        );

        cy.setLocalStorage(
          `${keyPrefixWithUsername}.refreshToken`,
          cognitoResponse.signInUserSession.refreshToken.token,
        );

        cy.setLocalStorage(
          `${keyPrefixWithUsername}.clockDrift`,
          cognitoResponse.signInUserSession.clockDrift,
        );

        cy.setLocalStorage(
          `${cognitoResponse.keyPrefix}.LastAuthUser`,
          cognitoResponse.username,
        );

        cy.setLocalStorage('amplify-authenticator-authState', 'signedIn');
        log.snapshot('after');
        log.end();
      });
    },
  );

  cy.visit('/');
};

export const signOut = () => {
  cy.log('Signing out from COGNITO');
  return Auth.signOut();
};
