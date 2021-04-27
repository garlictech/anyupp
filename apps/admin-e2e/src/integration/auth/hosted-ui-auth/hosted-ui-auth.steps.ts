import { When } from 'cypress-cucumber-preprocessor/steps';

When(
  'I fill out the username input with the {string} value',
  (value: string) => {
    cy.get('#username').last().type(value, { force: true });
  },
);

When('I fill out the code input with the {string} value', (value: string) => {
  cy.get('#code').type(value, { force: true });
});

When(
  'I fill out the password input with the {string} value',
  (value: string) => {
    cy.get('#password').last().type(value, { force: true });
  },
);
