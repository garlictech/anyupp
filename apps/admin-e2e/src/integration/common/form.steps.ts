import { When } from 'cypress-cucumber-preprocessor/steps';

When(
  'I fill out the input with id {string} with the {string} value',
  (id: string, value: string) => {
    cy.get(`#${id}`).type(value, { force: true });
  },
);

When(
  'I fill out the {string} input with the {string} id',
  (context: string, id: string) => {
    cy.findAllByPlaceholderText(context).type(id);
  },
);

When(
  'I fill out the {string} input with {string}',
  (inputLabel: string, value: string) => {
    cy.findAllByLabelText(inputLabel).first().clear().type(value);
  },
);

When(
  'I fill out the last {string} input with {string}',
  (inputLabel: string, value: string) => {
    cy.findAllByLabelText(inputLabel).last().clear().type(value);
  },
);
