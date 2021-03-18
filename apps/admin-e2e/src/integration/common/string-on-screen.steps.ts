import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('the language is set for {string}', (label: string) => {
  cy.findByText(label).should('exist');
});

When('I click on the {string} text', (label:string) => {
  cy.findByText(label).click();
});

Then('I see {string} header', (title: string) => {
  cy.get('h1').contains(title).findAllByText(title).should('exist');
});

Then('I see {string} label', (title: string) => {
  cy.get('label').contains(title).findAllByText(title).should('exist');
});

Then('the {string} title is displayed', (title: string) => {
  cy.get('label').contains(title).findAllByText(title).should('exist');
});

Then('the language is {string}', (label: string) =>{
  cy.findByText(label).click();
});

Then('I should see {string} text', (title: string) => {
  cy.findAllByText(title).should('exist');
});

Then('the {string} button is displayed', (title: string) => {
  cy.get('button').contains(title).findAllByText(title).should('exist');
});