import { Then, When } from 'cypress-cucumber-preprocessor/steps';
import { getActiveTab, getDialog } from '../../support';

Then('I should see {string} sub-header', (title: string) => {
  cy.contains('h3', title, { timeout: 15000 })
    .scrollIntoView()
    .should('be.visible');
});

Then('the {string} title is displayed', (title: string) => {
  cy.contains(title).scrollIntoView().should('be.visible');
});

Then('I should see {string} text', (text: string) => {
  cy.contains(text, { matchCase: false }).scrollIntoView().should('be.visible');
});

Then('I should see the {fixture} fixture', (fixture: string) => {
  cy.contains(fixture, { matchCase: false })
    .scrollIntoView()
    .should('be.visible');
});

Then('On the active tab I should see {string} text', (text: string) => {
  getActiveTab()
    .contains(text, { matchCase: false })
    .scrollIntoView()
    .should('be.visible');
});

When('I click the {string} text', (value: string) => {
  cy.contains(value, { matchCase: false }).click({ force: true });
});

When(
  'I click the {string} text with timeout {int}',
  (value: string, timeout: number) => {
    cy.contains(value, { matchCase: false, timeout }).click({
      force: true,
    });
  },
);

Then('I should see {string} text on the dialog', (text: string) => {
  getDialog().contains(text).should('be.visible');
});
