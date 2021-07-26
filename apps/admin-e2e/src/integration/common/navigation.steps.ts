import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

Given('I am on the login page', () => {
  cy.visit('/');
});

Then('I should be on the dashboard page', () => {
  cy.url({ timeout: 10000 }).should('include', '/dashboard');
});

Then('I should be on the login page', () => {
  cy.url({ timeout: 10000 }).should('include', '/login');
});
