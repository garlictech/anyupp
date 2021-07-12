import { defineParameterType } from 'cypress-cucumber-preprocessor/steps';

const fixtures: Record<string, string> = {
  adminEmail: 'test-monad@anyupp.com',
  adminPassword: 'Hideghegy12_',
  superuserContextId: 'SU_CTX_ID',
};

defineParameterType({
  name: 'fixture',
  regexp: new RegExp('.*'),
  // Cypress passes the apostrophes (", ') to this string. As we always pass
  // strings in apostrophes, we simply remove teh first and last characters. They are
  // always the apostrophes.
  transformer: s => fixtures[s] ?? s.slice(1, s.length - 1),
});
