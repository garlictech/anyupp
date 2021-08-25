import { Then, When } from 'cypress-cucumber-preprocessor/steps';

When(
  'I fill out the input with id {string} with the {fixture} value',
  (id: string, value: string) => {
    cy.get(`#${id}`).type(value, { force: true });
  },
);

When(
  'I fill out the last input with id {string} with the {fixture} value',
  (id: string, value: string) => {
    cy.get(`#${id}`).last().type(value, { force: true });
  },
);

When(
  'I fill out the {string} input with the {fixture} id',
  (context: string, id: string) => {
    cy.findAllByPlaceholderText(context).clear().type(id);
  },
);

When('I clear the input with id {string}', (id: string) => {
  cy.findAllByPlaceholderText(id).clear();
});

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
  'I fill out the {string} input with a fixture {fixture}',
  (inputLabel: string, value: string) => {
    cy.findAllByLabelText(inputLabel).first().clear().type(value);
  },
);

When(
  'I fill out the {string} input with {string} and some random text',
  (inputLabel: string, value: string) => {
    cy.findAllByLabelText(inputLabel)
      .first()
      .clear()
      .type(`${value} ${new Date().getTime()}`);
  },
);

When(
  'I fill out all the {string} input with index multiply by {int}',
  (inputLabel: string, value: number) => {
    cy.findAllByLabelText(inputLabel).each(($input, index) => {
      cy.wrap($input)
        .clear()
        .type((index * value).toString());
    });
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

When(
  'I fill out the component set reference price input with {string}',
  (value: string) => {
    cy.get('bgap-form-text-input')
      .last()
      .findByTestId('refGroupPrice')
      .clear()
      .type(value);
  },
);

When(
  'I fill out the component set price input with {string}',
  (value: string) => {
    cy.get('bgap-form-text-input')
      .last()
      .findByTestId('price')
      .clear()
      .type(value);
  },
);

When('I select the {string} in the modifier selector', (value: string) => {
  cy.findByTestId('productComponentSetId').click({ force: true });
  cy.findAllByText(value).first().click({ force: true });
});
