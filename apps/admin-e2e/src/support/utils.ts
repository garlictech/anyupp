export const getDialog = () => cy.get('nb-dialog-container');

export const getActiveTab = () => cy.get('nb-tab.content-active');

export const getListItemThatContains = (value: string) =>
  cy.contains('nb-list-item', value).scrollIntoView().should('be.visible');

export const getListItemFromActiveTabThatContains = (value: string) =>
  getActiveTab()
    .contains('nb-list-item', value)
    .scrollIntoView()
    .should('be.visible');

export const moveDownShouldWork = (listItemElementName: string) =>
  cy
    .get(listItemElementName)
    .eq(0)
    .then($listItem => {
      getListItemTitle($listItem).then(firstItemTitle => {
        cy.wrap($listItem).findAllByTitle('Move down').click();

        // Wait for the animation hack
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000);

        // No toaster on move up/down!
        // getSuccessToastr().should('be.visible');
        // getSuccessToastr().should('not.exist');
        cy.get(listItemElementName)
          .eq(1)
          .should('contain.text', firstItemTitle);
      });
    });

export const moveUpShouldWork = (listItemElementName: string) =>
  cy
    .get(listItemElementName)
    .eq(1)
    .then($listItem => {
      getListItemTitle($listItem).then(seconditemTitle => {
        cy.wrap($listItem).findAllByTitle('Move up').click();

        // Wait for the animation hack
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000);

        // No toaster on move up/down!
        // getSuccessToastr().should('be.visible');
        // getSuccessToastr().should('not.exist');
        cy.get(listItemElementName)
          .eq(0)
          .should('contain.text', seconditemTitle);
      });
    });

export const getListItemTitle = ($listItem: JQuery<HTMLElement>) =>
  cy.wrap($listItem).find('.name').invoke('text');

export const getSuccessToastr = () => cy.get('nb-toast.status-success');

export const scrollDownVirtualList = (testId: string) => {
  cy.findByTestId(testId).scrollTo('bottom');
};
