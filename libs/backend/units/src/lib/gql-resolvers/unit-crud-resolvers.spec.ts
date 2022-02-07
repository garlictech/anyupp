/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createUnitResolver,
  hashPasswords,
  updateUnitRKeeperDataResolver,
} from './unit-crud-resolvers';
import { UnitsResolverDeps } from './utils';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { maskDate, simpleFixtures } from '@bgap/shared/fixtures';

const getDeps = (): UnitsResolverDeps => ({
  crudSdk: undefined as any,
  hashGenerator: param => `${param} HASHED`,
  uuidGenerator: () => 'UUID',
  tableName: 'TABLENAME',
  docClient: {
    put: jest.fn().mockReturnValue({
      promise: () => Promise.resolve({ Attributes: 'DYNAMODB PUT RESULT' }),
    }),
    update: jest.fn().mockReturnValue({
      promise: () => Promise.resolve({ Attributes: 'UPDATE RESULT' }),
    }),
  } as any,
});

test('hashPasswords', () => {
  expect(
    hashPasswords(param => `${param} HASHED`)(simpleFixtures.getRKeeperUnit()),
  ).toMatchSnapshot('VALID PASSWORDS');
});

test('createUnitResolver', async () => {
  expect(
    await createUnitResolver(getDeps())({
      input: simpleFixtures.getUnit(),
    }).toPromise(),
  ).toMatchSnapshot({
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  });
});

const rkeeperCases = [
  {
    label: 'update everything',
    fixture: {
      unitId: 'UNITID',
      rkeeperUsername: 'NEW RKEEPER USERNAME',
      rkeeperPassword: 'NEW RKEEPER PASSWORD',
      anyuppPassword: 'NEW ANYUPP PASSWORD',
    },
  },

  {
    label: 'anyupp password only',
    fixture: {
      unitId: 'UNITID',
      anyuppPassword: 'NEW ANYUPP PASSWORD',
    },
  },
  {
    label: 'rkeeper password only',
    fixture: {
      unitId: 'UNITID',
      rkeeperPassword: 'NEW RKEEPER PASSWORD',
    },
  },
];

test.each(rkeeperCases)(
  'updateUnitRKeeperData: $label',
  ({ fixture }, done: any) => {
    const deps = getDeps();
    deps.crudSdk = {
      GetUnit: jest.fn().mockReturnValue(of(simpleFixtures.getRKeeperUnit())),
    } as any;

    updateUnitRKeeperDataResolver(deps)({
      input: fixture,
    })
      .pipe(
        tap(result => {
          expect(result).toMatchSnapshot('result');
          expect((deps.crudSdk.GetUnit as any).mock.calls).toMatchSnapshot(
            'GetUnit',
          );
          expect(
            maskDate((deps.docClient.update as any).mock.calls),
          ).toMatchSnapshot('update');
        }),
      )
      .subscribe(() => done());
  },
);
