import { Then, When } from 'cypress-cucumber-preprocessor/steps';

When('I click on the Move down button', () => {
  cy.findAllByTitle('Move down').first().click();
});

When('I click on the Move up button', () => {
  cy.findAllByTitle('Move up').last().click();
});

Then('I should wait for {int}', (value: number) => {
  cy.wait(value);
});

Then('the first item should be {string}', (value: string) => {
  cy.get('bgap-product-category-list-item').first().contains(value);
});

Then('the last item should be {string}', (value: string) => {
  cy.get('bgap-product-category-list-item').last().contains(value);
});
