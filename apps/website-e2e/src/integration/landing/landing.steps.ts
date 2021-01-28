import { Before, Given, Then } from 'cypress-cucumber-preprocessor/steps';

Before(() => {
  cy.visit('/');
});

Given('we are at the chain products', () => {
  cy.visit('admin/products');
});

Then('the {string} message is displayed', (message: string) => {
  cy.get('h1').contains(message);
});
