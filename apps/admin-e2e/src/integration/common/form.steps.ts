import { When } from 'cypress-cucumber-preprocessor/steps';

// When(
//   'I fill out the {string} input with {string}',
//   (inputLabel: string, value: string) => {
//     cy.findByLabelText(inputLabel).type(value, { force: true });
//   },
// );

// When(
//   'I fill out the input with {string} as placeholder with {string}',
//   (placeholder: string, value: string) => {
//     cy.findByPlaceholderText(placeholder).type(value);
//   },
// );

When(
  'I fill out the input with id {string} with the {string} value',
  (id: string, value: string) => {
    cy.get(`#${id}`).type(value, { force: true });
  },
);
