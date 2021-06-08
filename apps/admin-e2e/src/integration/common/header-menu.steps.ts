import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('I select the {string} chain in the header menu', (chain: string) => {
  cy.findByTestId('activeChainSelector').click();
  cy.findAllByText(chain).last().click();
});
