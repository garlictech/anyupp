import { When } from 'cypress-cucumber-preprocessor/steps';

When('I select the {string} context in the selector', (value: string) => {
  cy.findAllByTestId('role').last().click();
  cy.findAllByText(value).last().click();
});

When('I select the {string} chain in the selector', (value: string) => {
  cy.findAllByTestId('chainId').last().click();
  cy.findAllByText(value).last().click();
});

When('I select the {string} group in the selector', (value: string) => {
  cy.findAllByTestId('groupId').last().click();
  cy.findAllByText(value).last().click();
});

When('I select the {string} unit in the selector', (value: string) => {
  cy.findAllByTestId('unitId').last().click();
  cy.findAllByText(value).last().click();
});
