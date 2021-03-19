import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { type } from 'os';

  When('I click on the {string} text', (label:string) => {
    cy.get('a').contains(label).click({force: true});
  });

  When('I fill out the username input with {string}', (username: string) => {
    cy.get('#username').type(username);
  });

  When('I submit the form with {string} button', (inputLabel: string) => {
    cy.get('input[value="Sign in"]').first().click({force: true});
  });