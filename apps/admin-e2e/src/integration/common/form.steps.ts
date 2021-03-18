import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

When('I fill out the {string} input with {string}',
  (inputLabel: string, value: string) => {
    cy.findByLabelText(inputLabel).type(value);
  },
);

When('I click on the {string} checkbox', (checkbox:string) => {
  cy.get(checkbox).check();
});