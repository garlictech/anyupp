import { When } from 'cypress-cucumber-preprocessor/steps';

When('I click on the {string} icon', (icon: string) => {
  cy.contains('nb-icon', icon).click();
});

When('I click on the menu icon', () => {
  cy.get('.sidebar-toggle').click();
});

When('I click on the {string} text', (text: string) => {
  cy.findByText(text).click();
});

When('I click on the plus button', () => {
  cy.get('nb-icon[icon="plus-outline"]').click();
});

When('I click on the first Edit button', () => {
  cy.findAllByTitle('Edit').first().click({ force: true });
});

When(
  'I click the edit button in the listitem with {string} content',
  (name: string) => {
    cy.findAllByRole('listitem').contains(name).findByTitle('Edit').click();
  },
);

When('I click on the last Edit button', () => {
  cy.findAllByTitle('Edit').last().click({ force: true });
});

When('I click on the close button', () => {
  cy.get('nb-icon[icon="close-outline"]').click();
});

When('I click on the {string} checkbox', (checkboxName: string) => {
  cy.findByLabelText(checkboxName).click({ force: true });
});

When('I click on the {string} button', (value: string) => {
  cy.findByText(value).click();
});

When('I click on the {string} selector', (value: string) => {
  cy.contains('button', value).click({ force: true });
});

When('I select {string}', (value: string) => {
  cy.contains('nb-option', value).click();
});

// When('I click the selector to set {string}', (value: string) => {
//   cy.get('[caption="common.productType"]').click();
//   cy.findAllByText(value).click();
// });

When('I click on the {string} link', (value: string) => {
  cy.get('.tab-link').contains(value).click();
});

// When('I click the type selector to set {string}', (value: string) => {
//   cy.get('[caption="common.type"]', { timeout: 30000 }).click({ force: true });
//   cy.findAllByText(value).last().click({ force: true });
// });

// TODO: replace the caption match with something less brittle selection mode
When('I click the component selector to set {string}', (value: string) => {
  cy.get('[caption="productComponentSets.productComponent"]').click();
  cy.findAllByText(value).last().click();
});

// TODO: replace the caption match with something less brittle selection mode
When('I click on the modifier selector to add {string}', (value: string) => {
  cy.get('[caption="products.productModifierSet"]').click();
  cy.findAllByText(value).first().click();
});

When('I click on the first {string} button', (value: string) => {
  cy.findAllByTitle(value).first().click({ force: true });
});

// TODO: find it by title, if the button has no title we should request it from the ADMIN developers
// TODO: a button without a title is not user friendly either
When('I click on the download button', () => {
  cy.get('[icon="download-outline"]').first().click();
});
