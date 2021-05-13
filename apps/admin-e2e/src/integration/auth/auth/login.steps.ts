import { When } from 'cypress-cucumber-preprocessor/steps';

When(
  'I fill out the username input with the {string} value',
  (value: string) => {
    cy.get('#username').last().type(value, { force: true });
  },
);
// forgotten pw step
