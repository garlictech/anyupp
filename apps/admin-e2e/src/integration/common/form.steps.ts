import { When } from 'cypress-cucumber-preprocessor/steps';

When(
  'I fill out the {string} input with {string}',
  (inputLabel: string, value: string) => {
    cy.findByLabelText(inputLabel).type(value);
  }
);
