import { When } from 'cypress-cucumber-preprocessor/steps';

When('I click on the Move down button', () => {
  cy.findAllByTitle('Move down').first().click();
});

When('I click on the Move up button', () => {
  cy.findAllByTitle('Move up').last().should('exist').click({ force: true });
});
