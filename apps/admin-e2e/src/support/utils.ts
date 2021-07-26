export const getActiveTab = () => cy.get('nb-tab[ng-reflect-active="true"]');
export const getListItemFromActiveTabThatContains = (value: string) =>
  getActiveTab().contains('nb-list-item', value).should('be.visible');
