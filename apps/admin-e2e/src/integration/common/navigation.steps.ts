// I am on a page like tests
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { url } from 'inspector';

Given('I am on the login page', () => {
  cy.visit('/');
});

Given('I am on the dashboard page', () => {
  cy.url().should('include', '/dashboard')
});

Given('I am on the unit products list', () => {
  cy.url().should('include', '/products')
});

Given('I am at the chains page', () => {
  cy.url().should('include', '/chains')
});

Then('I should see the dashboard page', () => {
  cy.url().should('include', '/dashboard')
});

Then('I should see the login page', () => {
  cy.url().should('include', '/login')
});