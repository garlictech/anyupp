import { When } from 'cypress-cucumber-preprocessor/steps';

When('I click the {string} selector to set {string}', (name: string, value: string) =>{
    cy.findByRole('button').contains(name).click().select(value);
}); 

// When('I click the chain selector to set {string}', () =>{
//     cy.get('.form-control-group').first().click();
//     cy.findByText('test chain updated').last().click();
// }); 

// this was for the parent chain selector