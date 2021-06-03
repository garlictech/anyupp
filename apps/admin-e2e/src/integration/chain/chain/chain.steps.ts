import { Then, When } from 'cypress-cucumber-preprocessor/steps';
//import { When } from "cypress-cucumber-preprocessor/steps/index";

When(
  'I click on the {string} picker fill out with {string}',
  (title: string, color: string) => {
    cy.get('.form-control-group').contains(title).click();
    cy.get('.hex-text input').last().clear({force: true}).type(color, {force: true});
});

Then(
  'I should see {int} color picker with {string}',
  (num: number, color: string) => {
    cy.findAllByText(color).should('have.length', num);
  },
);
