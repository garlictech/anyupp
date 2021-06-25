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
  cy.findAllByText(value).first().click();
});

Then('The category selector should contain {string}', (value: string) => {
  cy.findByTestId('productCategoryId').contains(value).should('exist');
});
