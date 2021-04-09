import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('I should see {string} header', (title: string) => {
  cy.get('h1').contains(title).findAllByText(title).should('exist');
});

Then('I should see {string} sub-header', (title: string) => {
  cy.get('h3').contains(title).findAllByText(title).should('exist');
});

Then('I should see {string} label', (title: string) => {
  cy.get('label').contains(title).findAllByText(title).should('exist');
});

Then('the {string} title is displayed', (title: string) => {
  cy.findAllByText(title).should('exist');
});

//Then('the {string} button is displayed', (title: string) => {
//  cy.get('button').contains(title).findAllByText(title).should('exist');
//});
