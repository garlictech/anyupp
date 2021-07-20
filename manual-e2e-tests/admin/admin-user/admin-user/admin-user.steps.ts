import { When } from 'cypress-cucumber-preprocessor/steps';

When(
  'I click on the edit role button in the listitem with {string} content',
  (name: string) => {
    cy.findAllByRole('listitem')
      .contains(name)
      .findByTitle('Edit roles')
      .click({ force: true });
  },
);

When('I select the {string} in the role context selector', (value: string) => {
  cy.findByTestId('roleContextId').click();
  cy.findAllByText(value).first().click();
});
