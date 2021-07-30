export const getActiveTab = () => cy.get('nb-tab.content-active');

export const getListItemThatContains = (value: string) =>
  cy.contains('nb-list-item', value).should('be.visible');

export const getListItemFromActiveTabThatContains = (value: string) =>
  getActiveTab().contains('nb-list-item', value).should('be.visible');
