import { When } from 'cypress-cucumber-preprocessor/steps';

When('I fill out the username input with the {string} value', (value: string) => {
    cy.get('#username').last().type(value, { force: true });
  });
  
When('I click the profile button', () =>{
    cy.get('nb-user').click({force: true});
});

When('I click on the {string} title', (title: string) =>{
    cy.contains(title).click({force: true});
});