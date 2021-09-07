import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { fixtures } from '../../fixtures/global';
import { loginByCognitoApi } from '../../support';

Given('I am on the dashboard as an authenticated superUser', () => {
  // Programmatically login via Amazon Cognito API
  loginByCognitoApi(
    fixtures.adminEmail,
    fixtures.adminPassword,
    fixtures.superuserContextId,
  );
  cy.url({ timeout: 10000 }).should('include', '/dashboard');
});

Then('the context input should contain {fixture}', (id: string) => {
  cy.findByDisplayValue(id).should('exist');
});
