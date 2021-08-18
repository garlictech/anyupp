import { Then, When } from 'cypress-cucumber-preprocessor/steps';

Then('I should see the Send Code button', () => {
  cy.contains('Send Code', { matchCase: false }).should('be.visible');
});

When('I click on the send code button', () => {
  cy.findByText('Send Code').click();
});

Then('I should see {string} error message', (value: string) => {
  cy.findByText(value, { timeout: 10000 }).should('be.visible');
});

Then('I should see {string} message', (value: string) => {
  cy.contains(value).should('be.visible');
});
