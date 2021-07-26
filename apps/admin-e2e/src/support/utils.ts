export const getActiveTab = () => cy.get('nb-tab[ng-reflect-active="true"]');
export const getListItemFromActiveTabThatContains = (value: string) =>
  getActiveTab().contains('nb-list-item', value).should('be.visible');
export const getListItemThatContains = (value: string) =>
  cy.contains('nb-list-item', value).should('be.visible');
