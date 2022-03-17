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
  'I click on the #{string} seat of the #{string} table',
  (seatId: string, tableId: string) => {
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

When('I click on {string} button at the first order', (buttonName: string) => {
  cy.findAllByTestId('orderStatusBtn').contains(buttonName).first().click();
});

Then('I should see the button in {string}', (buttonName: string) => {
  cy.findAllByTestId('orderStatusBtn').contains(buttonName).first();
});

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

When('I click the {string} icon with title', (name: string) => {
  cy.findAllByTitle(name).click();
});

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

When('I click on the arrow button on the placed product', () => {
  // cy.findByTestId('placedLaneItem_0').first().contains('button').click();
  cy.get('button').contains('icon="arrow-right-outline"').click();
});

When('I click on the arrow button on the processed product', () => {
  cy.findByTestId('processingLaneItem_0')
    .first()
    .contains('button[icon="arrow-right-outline"]')
    .click();
});

When('I click on the arrow button on the finished product', () => {
  cy.findByTestId('readyLaneItem_0')
    .first()
    .contains('button[icon="arrow-left-outline"]')
    .click();
});

When(
  'I fill out the {string} input with the {string} id',
  (value: string, id: string) => {
    cy.findAllByPlaceholderText(value).clear().type(id);
  },
);

When('I click on the print button', () => {
  cy.get('nb-icon[icon="print"]').click();
});

Then('I should see the {string} text', (text: string) => {
  cy.findAllByText(text).should('be.visible');
});

When('I wait {int} ms', (time: number) => {
  cy.wait(time);
});

// When('I click on the date picker', () => {
//   cy.get()
// })
