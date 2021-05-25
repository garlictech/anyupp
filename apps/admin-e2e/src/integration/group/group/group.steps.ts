import { When } from 'cypress-cucumber-preprocessor/steps';

When('I click the selector to set {string}', (value: string) => {
  cy.findByRole('.select-button').click().select(value);
});
