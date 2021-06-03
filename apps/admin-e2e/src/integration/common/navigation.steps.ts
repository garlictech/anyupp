import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

Given('I am on the login page', () => {
  cy.visit('/');
});

Then('I should be on the dashboard page', () => {
  cy.url().should('include', '/dashboard', {timeout: 50000});
});
