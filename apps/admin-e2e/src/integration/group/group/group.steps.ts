import { When } from 'cypress-cucumber-preprocessor/steps';

When('I click the {string} selector to set {string}', (name: string, value: string) =>{
    cy.findByRole('button').contains(name).click().select(value);
}); 