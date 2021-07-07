import { Then, When } from 'cypress-cucumber-preprocessor/steps';

// forgotten pw step
When(
  'I fill out the username input with the {string} value',
  (value: string) => {
    cy.get('#username').last().type(value, { force: true });
  },
);

Then('I should see the Send Code button', () => {
  cy.contains('Send Code', { matchCase: false }).should('exist');
});

When('I click on the send code button', () => {
  cy.findByText('Send Code').click();
});
