import { When } from 'cypress-cucumber-preprocessor/steps';

When(
  'I click the {string} day selector to set {string}',
  (name: string, value: string) => {
    cy.findByTestId(name).click();
    cy.get('nb-option').contains(value).click();
  },
);
