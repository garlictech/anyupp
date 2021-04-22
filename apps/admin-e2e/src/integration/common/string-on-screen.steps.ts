import { Then, When } from 'cypress-cucumber-preprocessor/steps';

// Then('I should see {string} header', (title: string) => {
//   cy.get('h1').contains(title).findAllByText(title).should('exist');
// });

// This CONTAINS selector is our friend from now
Then('I should see {string} sub-header', (title: string) => {
  cy.contains('h3', title).should('exist', { timeout: 15000 } );
});

// Then('I should see {string} label', (title: string) => {
//   cy.get('label').contains(title).findAllByText(title).should('exist');
// });
// This CONTAINS selector is our friend from now

Then('the {string} label is displayed', (label: string) => {
  cy.contains('.form-field', label).should('exist');
});

Then('I should see {string} text', (value: string) => {
  cy.contains(value, { matchCase: false }).should('exist');
});

// This CONTAINS selector is our friend from now
When('I click the {string} text', (value: string) => {
  cy.contains(value, { matchCase: false }).click({
    timeout: 20000,
    force: true,
  });
});
