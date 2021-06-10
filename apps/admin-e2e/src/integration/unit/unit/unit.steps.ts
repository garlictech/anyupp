import { When } from 'cypress-cucumber-preprocessor/steps';

When('I fill all the hour inputs', () => {
  cy.findAllByPlaceholderText('hh:mm').each(($hourInput, index) => {
    const hour = index.toString().padStart(2, '0'); // 3 => 03
    cy.wrap($hourInput).clear().type(`${hour}:00`);
  });
});

When('I click on the Color picker fill out with {string}', (color: string) => {
  cy.get('.color-picker-input').last().click({ force: true });
  cy.get('.hex-text input')
    .last()
    .clear({ force: true })
    .type(color, { force: true });
});

When('I add a Custom date with {string}', (value: string) => {
  cy.get('#addCustomDate').click({ force: true });
  cy.get('input[type="date"]').last().type(value);
});
