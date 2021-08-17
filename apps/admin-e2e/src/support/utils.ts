export const getDialog = () => cy.get('nb-dialog-container');

export const getActiveTab = () => cy.get('nb-tab.content-active');

export const getListItemThatContains = (value: string) =>
  cy.contains('nb-list-item', value).should('be.visible');

export const getListItemFromActiveTabThatContains = (value: string) =>
  getActiveTab().contains('nb-list-item', value).should('be.visible');

export const moveDownShouldWork = (listItemElementName: string) =>
  cy
    .get(listItemElementName)
    .eq(0)
    .then($listItem => {
      getListItemTitle($listItem).then(firstItemTitle => {
        cy.wrap($listItem).findAllByTitle('Move down').click();
        getSuccessToastr().should('be.visible');
        getSuccessToastr().should('not.exist');
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
        getSuccessToastr().should('be.visible');
        getSuccessToastr().should('not.exist');
        cy.get(listItemElementName)
          .eq(0)
          .should('contain.text', seconditemTitle);
      });
    });

export const getListItemTitle = ($listItem: JQuery<HTMLElement>) =>
  cy.wrap($listItem).find('.user-name').invoke('text');

export const getSuccessToastr = () => cy.get('nb-toast.status-success');
