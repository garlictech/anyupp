import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('I should see {string} header', (title: string) => {
  cy.get('h1').contains(title).findAllByText(title).should('exist');
});

Then('I should see {string} label', (title: string) => {
  cy.get('label').contains(title).findAllByText(title).should('exist');
});

//Then('the {string} title is displayed', (title: string) => {
//  cy.findAllByText(title).should('exist');
//});

//Given('the language is set for {string}', (label: string) => {
//  cy.findByText(label).should('exist');
//});

//Then('the language is {string}', (label: string) =>{
//  cy.findByText(label).click();
//});

//Then('I should see {string} text', (title: string) => {
//  cy.findAllByText(title).should('exist');
//});

//Then('the {string} button is displayed', (title: string) => {
//  cy.get('button').contains(title).findAllByText(title).should('exist');
//});