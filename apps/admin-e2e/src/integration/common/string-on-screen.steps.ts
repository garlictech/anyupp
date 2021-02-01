import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('I should see {string} text', (title: string) => {
  cy.findAllByText(title).should('exist');
});

Then('I should see {string} title', (title: string) => {
  cy.findByTitle(title).should('exist');
});
