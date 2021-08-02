import { Then, When } from 'cypress-cucumber-preprocessor/steps';

Then('I select the {string} in the category selector', (value: string) => {
  cy.findByTestId('productCategoryId').click();
  cy.findAllByText(value).last().click();
});

Then('I select the {string} in the product type selector', (value: string) => {
  cy.findByTestId('productType').click();
  cy.findAllByText(value).last().click();
});

When('I select the {string} in the modifier selector', (value: string) => {
  cy.findByTestId('productComponentSetId').click();
  cy.contains(value).first().click();
});

Then('The category selector should contain {string}', (value: string) => {
  cy.findByTestId('productCategoryId').contains(value).should('exist');
});

When(
  'I click the {string} day selector to set {string}',
  (name: string, value: string) => {
    cy.findByTestId(name).click();
    cy.get('nb-option').contains(value).click();
  },
);
