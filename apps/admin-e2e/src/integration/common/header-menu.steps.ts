import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('I select the {string} chain in the header menu', (value: string) => {
  cy.findByTestId('activeChainSelector').click();
  cy.findAllByText(value).first().click();
});
Then('I select the {string} group in the header menu', (value: string) => {
  cy.findByTestId('activeGroupSelector').click();
  cy.findAllByText(value).first().click();
});
Then('I select the {string} unit in the header menu', (value: string) => {
  cy.findByTestId('activeUnitSelector').click();
  cy.findAllByText(value).first().click();
});
