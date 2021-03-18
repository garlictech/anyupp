import { Given, When } from 'cypress-cucumber-preprocessor/steps';
import { data } from 'cypress/types/jquery';

When('I click on the input', (datatable) =>{
    datatable.hashes().forEach(element => {
        cy.get('input[type]').type()
    })
})

When('I fill out with', (da))