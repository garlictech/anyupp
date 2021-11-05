import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('I set the language to EN', () => {
  const langMap: { [key: string]: string } = {
    'en-US': 'English',
    'de-DE': 'Englisch',
    'hu-HU': 'Angol',
  };
  cy.findByTestId('languageMenu', { timeout: 20000 })
    .scrollIntoView()
    .should('be.visible');
  cy.getLocalStorage('selectedLanguage').then(selectedLanguage => {
    cy.findByTestId('languageMenu').click();
    const desiredLangText = selectedLanguage
      ? langMap[selectedLanguage]
      : langMap['en-US'];
    cy.findByText(desiredLangText).click(); // Select new language
  });
});
