import { Then, When } from 'cypress-cucumber-preprocessor/steps';

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

When('I set the currency to {string}', (value: string) => {
  cy.findByTestId('currency').click();
  cy.findAllByText(value).last().click();
});

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

Then(
  'The {string} input should contain {string}',
  (inputLabel: string, value: string) => {
    cy.findAllByLabelText(inputLabel).first().should('contain.value', value);
  },
);

Then('The chain selector should contain {string}', (value: string) => {
  cy.findByTestId('chainId').contains(value).should('exist');
});

Then('The group selector should contain {string}', (value: string) => {
  cy.findByTestId('groupId').contains(value).should('exist');
});
