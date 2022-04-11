import { When } from 'cypress-cucumber-preprocessor/steps';

When('I wait {int} ms', (time: number) => {
  cy.wait(time);
});
