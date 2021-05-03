import { When, Then } from 'cypress-cucumber-preprocessor/steps';

When('I click on the profile button', () =>{
    cy.findByText('John Doe').click({force: true});
});

When('I click on the {string} title', (title: string) =>{
    cy.contains(title).click({force: true});
});

Then('I should be on the login page', () => {
    cy.url().should('include', '/login');
  });