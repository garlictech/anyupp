import { unitFixture } from '@bgap/shared/fixtures';
import {
  createUnitResolver,
  hashPasswords,
  updateUnitResolver,
} from './unit-crud-resolvers';
import { UnitsResolverDeps } from './utils';

test('hashPasswords', () => {
  expect(
    hashPasswords(param => `${param} HASHED`)(unitFixture.createRkeeperUnit),
  ).toMatchSnapshot('VALID PASSWORDS');
});

test('createUnitResolver', async () => {
  const deps: UnitsResolverDeps = {
    crudSdk: undefined as any,
    hashGenerator: param => `${param} HASHED`,
    uuidGenerator: () => 'UUID',
    tableName: 'TABLENAME',
    docClient: {
      put: jest.fn().mockReturnValue({
        promise: () => Promise.resolve('RESULT'),
      }),
    } as any,
  };

  expect(
    await createUnitResolver(deps)({
      input: unitFixture.createRkeeperUnit,
    }).toPromise(),
  ).toMatchSnapshot();
});
