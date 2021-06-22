import { When, Then } from 'cypress-cucumber-preprocessor/steps';
import { values } from 'cypress/types/lodash';

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

When(
  'I click the edit button in the listitem with {string} content',
  (name: string) => {
    cy.findAllByRole('listitem')
      .wait(3000)
      .contains(name)
      .findByTitle('Edit')
      .click();
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

When('I click on the button with title {string}', (value: string) => {
  cy.findByTitle(value).click();
});

When('I click on the {string} link', (value: string) => {
  cy.get('.tab-link').contains(value).click();
});

When('I click on the first {string} button', (value: string) => {
  cy.findAllByTitle(value).first().click({ force: true });
});

When('I select {string} in the type selector', (value: string) => {
  cy.findByTestId('type').click();
  cy.findAllByText(value).last().click();
});

When('I click the component selector to set {string}', (value: string) => {
  cy.findByTestId('productComponentId').click();
  cy.findAllByText(value).last().click();
});

When('I click the lane selector to set {string}', (value: string) => {
  cy.findByTestId('laneId').click();
  cy.findAllByText(value).last().click();
});

When(
  'I click the delete button in the listitem with {string} content',
  (name: string) => {
    cy.findAllByRole('listitem')
      .contains(name)
      .findAllByTitle('Delete')
      .click();
  },
);

When('I click the category selector to set {string}', (value: string) => {
  cy.get('bgap-active-product-category-selector').click();
  cy.findAllByText(value).last().click();
});
