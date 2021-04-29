import { When } from 'cypress-cucumber-preprocessor/steps';
//import { When } from "cypress-cucumber-preprocessor/steps/index";

//When('I click on the menu button', () => {
//    cy.get('.sidebar-toggle]').click();
//  });
// menu button

// When('I click on the plus button', () => {
//     cy.get('button').click();
//   });

// When('I click on the edit button', () => {
//     cy.get('button').click();
//   });

// When('I fill out the {string} input with {string}', (dataTable) =>{
    //     console.log(dataTable);
    // });
    //datatable
    
When('I click on the {string} selector', (value: string) => {
    cy.contains('button', value).click({force: true});
});

When('I select {string}', (value: string) => {
    cy.contains('nb-select', 'Chain').select(value);
})