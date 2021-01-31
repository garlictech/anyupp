// I am on a page like tests
import { Given } from 'cypress-cucumber-preprocessor/steps';

Given('I am on the login page', () => {
  cy.visit('/');
  cy.login;
  cy.findAllByAltText;
});
