import { When } from 'cypress-cucumber-preprocessor/steps';

// When('I click on the {string} button', (buttonTitle: string) => {
//   cy.findByRole('button').contains(new RegExp(buttonTitle, 'i')).click();
// });

When('I click on the {string} icon', (icon: string) => {
  cy.contains('nb-icon', icon).click();
});

When('I click on the menu icon', () => {
    cy.get('.sidebar-toggle').click();
  });
// menu button

When('I click on the {string} text', (text: string) => {
    cy.contains('a', text).click({force: true});
});

When('I click on the plus button', () => {
    cy.get('nb-icon[icon="plus-outline"]').click();
});

When('I click on the first Edit button', () => {
    cy.findAllByTitle('Edit').first().click();
});

When('I click on the close button', () => {
    cy.get('nb-icon[icon="close-outline"]').click();
});

When('I click on the submit button', () => {
    cy.get('.mt-20').contains('Submit', {matchCase: false}).click();
    // cy.findAllByLabelText('Submit').click();
});

When('I click on the Active checkbox', () => {
    cy.findByRole('checkbox').check({force: true});
});

When('I click on the {string} button', (map: string) => {
    cy.findAllByText(map).click({force: true});
});
// locate on map button

// When('I click on the {string} selector', (value: string) => {
    // cy.contains('button', value).click({force: true});
//     cy.findByRole('button').contains(value).click({force: true});
// });
// selector step

// When('I select {string}', (value: string) => {
//         cy.contains('nb-option', value).click();
//     });
// selector step