// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
// Commands from 3rd party libs
import '@testing-library/cypress/add-commands';
import addContext from 'mochawesome/addContext';
import './commands';
import './global-fixtures';

export * from './auth-provider-commands/cognito';
export * from './mailtrap';
export * from './utils';

Cypress.on('test:after:run', (test, runnable) => {
  if (test.state === 'failed') {
    const screenshot = `${Cypress.config('screenshotsFolder')}/${
      Cypress.spec.name
    }/${runnable?.parent?.title} -- ${test.title} (failed).png`;
    addContext(<Mocha.Context>{ test }, screenshot);
  }
});

// returning false here prevents Cypress from
// failing the test
// Cypress.on('uncaught:exception', (err, runnable) => {
//   console.log('Error from the app', JSON.stringify(err, undefined, 2));
//   return false;
// });
