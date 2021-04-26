import { Then, When } from 'cypress-cucumber-preprocessor/steps';

Then('I should see {string} sub-header', (title: string) => {
  cy.contains('h3', title).should('exist');
});

Then('the {string} title is displayed', (title: string) => {
  cy.contains(title).should('exist');
});

Then('I should see {string} text', (value: string) => {
  cy.contains(value, { matchCase: false }).should('exist');
});

When('I click the {string} text', (value: string) => {
  cy.contains(value, { matchCase: false }).click({ timeout: 20000, force: true,});
});