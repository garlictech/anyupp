import { When } from 'cypress-cucumber-preprocessor/steps';
import {
  getListItemFromActiveTabThatContains,
  getListItemThatContains,
} from '../../support';

When('I click on the {string} icon', (icon: string) => {
  cy.contains('nb-icon', icon).click();
});

When('I click on the menu icon', () => {
  cy.get('.sidebar-toggle').click();
});

When('I click on the {string} text', (text: string) => {
  cy.findByText(text).click();
});

When(
  'I click the edit button in the listitem with {string} content',
  (name: string) => {
    getListItemThatContains(name).scrollIntoView().findByTitle('Edit').click();
  },
);

When(
  'On the active tab I click the edit button in the listitem with {string} content',
  (name: string) => {
    getListItemFromActiveTabThatContains(name).findByTitle('Edit').click();
  },
);

When(
  'On the active tab I click the extend button in the listitem with {string} content',
  (name: string) => {
    getListItemFromActiveTabThatContains(name)
      .findByTitle('Extend product')
      .click();
  },
);

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
  cy.findAllByTitle(value).first().click();
});

When('I click on the {string} title', (title: string) => {
  cy.contains(title).click({ force: true });
});

When('I click to the header user button', async () => {
  cy.get('nb-user[data-testid="userMenu"]').click();
});

When('I click on the {string} link', (value: string) => {
  cy.get('.tab-link').contains(value).click();
});

When('I click on the first {string} button', (value: string) => {
  cy.findAllByTitle(value).first().click({ force: true });
});

When('I select {string} in the type selector', (value: string) => {
  cy.findAllByTestId('type').last().click();
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
    cy.contains('nb-list-item', name).findAllByTitle('Delete').click();
  },
);

When('I click the category selector to set {string}', (value: string) => {
  cy.get('bgap-active-product-category-selector').click();
  cy.findAllByText(value).last().click();
});

When('I click the {string} button', (value: string) => {
  cy.findAllByTestId(value).last().click();
});
