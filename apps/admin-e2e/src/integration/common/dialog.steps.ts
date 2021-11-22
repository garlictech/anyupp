import { Then } from 'cypress-cucumber-preprocessor/steps';
import { getDialog, getSuccessToastr } from '../../support';

Then('The dialog should be visible', () => {
  getDialog().scrollIntoView().should('be.visible');
});

Then('The dialog should NOT exist', () => {
  getDialog().should('not.exist');
});

Then('I should see a success toastr', () => {
  getSuccessToastr().should('be.visible');
  getSuccessToastr().should('not.exist');
});
