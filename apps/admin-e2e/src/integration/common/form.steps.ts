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
// these two login steps belong here, because we need this in every feature's background

When(
  'I fill out the {string} input with {string}',
  (inputLabel: string, value: string) => {
    cy.findByLabelText(inputLabel).clear().type(value);
  },
);
// form step (chain, group, unit, etc.)
