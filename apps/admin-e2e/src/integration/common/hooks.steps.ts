import { After } from 'cypress-cucumber-preprocessor/steps';
import { signOut } from '../../support';

// Theses hooks will be executed after all the scenarios

After(() => {
  return signOut();
});
