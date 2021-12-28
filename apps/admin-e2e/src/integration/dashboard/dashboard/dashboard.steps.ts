import { When, Then } from 'cypress-cucumber-preprocessor/steps';

When('I click on the #{string} table', (tableId: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cy.findByTestId('fabricCanvas').then((canvas: any) => {
    const fabricCanvas = canvas?.[0]?.fabricCanvas;
    const seatObj = fabricCanvas
      .getObjects()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .find((o: any) => o.data?.tID === tableId && o.type.includes('table'));
    fabricCanvas.fire('mouse:up', { target: seatObj });
  });
});

When(
  'I click on the #{string} seat of #{string} table',
  (tableId: string, seatId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cy.findByTestId('fabricCanvas').then((canvas: any) => {
      const fabricCanvas = canvas?.[0]?.fabricCanvas;
      const seatObj = fabricCanvas.getObjects().find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (o: any) =>
          o.data?.tID === tableId &&
          o.data?.sID === seatId &&
          o.type.includes('seat'),
      );
      fabricCanvas.fire('mouse:up', { target: seatObj });
    });
  },
);

When(
  'I click on {string} button at the #{string} order',
  (buttonName: string) => {
    // cy.get('bgap-order-details').contains(number).scrollIntoView().next();
    cy.get('div.row.p-0.m-0').last().contains('button', buttonName).click();
  },
);

Then('the {string} icon is selected', () => {
  cy.findByTestId('currentOrdersAction').contains('nb-action.active');
});

Then('I should see a {string} table', (tableName: string) => {
  cy.get('bgap-reports-product-mix').findAllByText(tableName);
});

Then(
  'I should see {int} orders on the {string} icon',
  (num: number, name: string) => {
    cy.findAllByTitle(name).contains(num);
  },
);

Then('I should see {int} orders on the list', (num: number) => {
  cy.get('nb-list-item').should('have.length', num);
});

When('I click on the #{string} order item', (number: string) => {
  cy.get('nb-list-item').contains(number).click();
});

// Then('I should see the order in {string}', (value: string) => {
//   cy.findAllByText(value).should('be.visible');
// });

When('I click the button with title {string}', (title: string) => {
  cy.findAllByTitle(title).should('exist').click();
});

When('I click on the {string} option', (option: string) => {
  cy.get('nb-option').contains(option).click();
});
