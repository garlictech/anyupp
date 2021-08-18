import { defineParameterType } from 'cypress-cucumber-preprocessor/steps';
import { fixtures } from '../fixtures/global';

defineParameterType({
  name: 'fixture',
  regexp: new RegExp('.*'),
  // Cypress passes the apostrophes (", ') to this string. As we always pass
  // strings in apostrophes, we simply remove the first and last characters. They are
  // always the apostrophes.
  transformer: s =>
    (fixtures as Record<string, string>)[s] ?? s.slice(1, s.length - 1),
});
