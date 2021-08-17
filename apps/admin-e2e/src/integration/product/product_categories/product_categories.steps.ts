import { Then, When } from 'cypress-cucumber-preprocessor/steps';
import { moveDownShouldWork, moveUpShouldWork } from '../../../support';

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

When(
  'I click the down arrow on the first productCategory item, it should become the second',
  () => moveDownShouldWork('bgap-product-category-list-item'),
);
When(
  'I click the up arrow on the second productCategory item, it should become the first',
  () => moveUpShouldWork('bgap-product-category-list-item'),
);
