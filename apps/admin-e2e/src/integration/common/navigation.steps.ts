// I am on a page like tests
import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

Given('I am on the login page', () => {
  cy.visit('/');
});

Given('I am on the dashboard page', () => {
  cy.visit('/dashboard');
});

Then('I should be on the Dashboard page', () => {
  cy.url().should('include', '/dashboard');
});
