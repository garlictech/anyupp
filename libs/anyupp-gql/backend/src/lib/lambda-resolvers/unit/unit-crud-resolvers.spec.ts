import { unitFixture } from '@bgap/shared/fixtures';
import { createUnitResolver, hashPasswords } from './unit-crud-resolvers';
import { UnitsResolverDeps } from './utils';

test('hashPasswords', () => {
  expect(
    hashPasswords(param => `${param} HASHED`)(unitFixture.createRkeeperUnit),
  ).toMatchSnapshot('VALID PASSWORDS');
});

test('createUnitResolver', async () => {
  const deps: UnitsResolverDeps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    crudSdk: undefined as any,
    hashGenerator: param => `${param} HASHED`,
    uuidGenerator: () => 'UUID',
    tableName: 'TABLENAME',
    docClient: {
      put: jest.fn().mockReturnValue({
        promise: () => Promise.resolve('RESULT'),
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  };

  expect(
    await createUnitResolver(deps)({
      input: unitFixture.createRkeeperUnit,
    }).toPromise(),
  ).toMatchSnapshot({
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  });
});
