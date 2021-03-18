import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { type } from 'os';

When('I click on the {string} button', (buttonTitle: string) => {
  cy.findByRole('button').contains(new RegExp(buttonTitle, 'i')).click();
});

When('I click on the first {string} button', (buttonTitle: string) => {
  cy.findByRole('button').contains(new RegExp(buttonTitle, 'i')).click();
});

When('I click on the {string} selector button', (buttonTitle:string) =>{
  cy.findByRole('button').contains(new RegExp(buttonTitle, 'i')).click();
});