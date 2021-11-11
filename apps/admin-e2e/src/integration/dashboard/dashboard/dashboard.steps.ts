import { When } from 'cypress-cucumber-preprocessor/steps';

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
      const seatObj = fabricCanvas
        .getObjects()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .find(
          (o: any) =>
            o.data?.tID === tableId &&
            o.data?.sID === seatId &&
            o.type.includes('seat'),
        );
      fabricCanvas.fire('mouse:up', { target: seatObj });
    });
  },
);
