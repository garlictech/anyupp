import { When } from 'cypress-cucumber-preprocessor/steps';

When('I click on the {string} icon', (icon: string) => {
  cy.contains('nb-icon', icon).click();
});

When('I click on the menu icon', () => {
  cy.get('.sidebar-toggle').click();
});

When('I click on the {string} text', (text: string) => {
  cy.findByText(text).click({ force: true });
});

When('I click on the plus button', () => {
  cy.get('nb-icon[icon="plus-outline"]').click();
});

When('I click on the first Edit button', () => {
  cy.findAllByTitle('Edit').first().click({ force: true });
});

When('I click on the last Edit button', () => {
  cy.findAllByTitle('Edit').last().click({ force: true });
});

When('I click on the close button', () => {
  cy.get('nb-icon[icon="close-outline"]').click();
});

When('I click on the {string} checkbox', (checkboxName: string) => {
  cy.findAllByLabelText(checkboxName).click({ force: true });
});

When('I click on the {string} button', (value: string) => {
  cy.findAllByText(value).click({ force: true });
});

When('I click on the {string} selector', (value: string) => {
  cy.contains('button', value).click({ force: true });
});

When('I select {string}', (value: string) => {
  cy.contains('nb-option', value).click();
});

When('I set the currency to {string}', (value: string) => {
  cy.get('[caption="common.currency"]').click();
  cy.findAllByText(value).click();
});

When('I click on the {string} link', (value: string) => {
  cy.get('.tab-link').contains(value).click();
});

When('I click on the first {string} button', (value: string) => {
  cy.findAllByTitle(value).first().click({ force: true });
});

When('I click on the download button', () => {
  cy.get('[icon="download-outline"]').first().click();
});
