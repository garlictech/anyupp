import { Then, When } from 'cypress-cucumber-preprocessor/steps';

Then('I should see {string} sub-header', (title: string) => {
  cy.contains('h3', title, { timeout: 15000 }).should('exist');
});

Then('the {string} title is displayed', (title: string) => {
  cy.contains(title).should('exist');
});

Then('I should see {string} text', (text: string) => {
  cy.contains(text, { matchCase: false }).should('exist');
});

When('I click the {string} text', (value: string) => {
  cy.contains(value, { matchCase: false }).click({ timeout: 60000, force: true,});
});
