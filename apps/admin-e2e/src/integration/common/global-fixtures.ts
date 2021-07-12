import { defineParameterType } from 'cypress-cucumber-preprocessor/steps';

const fixtures: Record<string, string> = {
  adminEmail: 'test-monad@anyupp.com',
  adminPassword: 'Hideghegy12_',
  superuserContextId: 'SU_CTX_ID',
};

defineParameterType({
  name: 'fixture',
  regexp: new RegExp('.*'),
  transformer: s => fixtures[s] ?? s,
});
