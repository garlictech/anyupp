import { When } from 'cypress-cucumber-preprocessor/steps';

When('I click on the {string} button', (buttonTitle: string) => {
  cy.findByRole('button').contains(new RegExp(buttonTitle, 'i')).click();
});

When('I click on the {string} submit button', (inputTitle: string) => {
  cy.findByRole('input').contains(new RegExp(inputTitle, 'i')).click();
});

//When('I click on the first {string} button', (buttonTitle: string) => {
//  cy.findByRole('button').contains(new RegExp(buttonTitle, 'i')).click();
//});

//When('I click on the {string} selector button', (buttonTitle:string) =>{
//  cy.findByRole('button').contains(new RegExp(buttonTitle, 'i')).click();
//});