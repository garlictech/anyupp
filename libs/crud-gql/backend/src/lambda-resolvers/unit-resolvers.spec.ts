import * as CrudApi from '@bgap/crud-gql/api';
import {
  UnitResolverDeps,
  createUnitResolver,
  updateUnitResolver,
} from './unit-resolvers';
import { DynamoDB } from 'aws-sdk';
import { unitFixture } from '@bgap/shared/fixtures';

describe('Test custom CRUD resolvers', () => {
  const getDeps = (): UnitResolverDeps => ({
    hashGenerator: (param: string) => Promise.resolve(`HASHED ${param}`),
    tableName: 'UNIT_TABLE_NAME',
    docClient: new DynamoDB.DocumentClient(),
    uuidGenerator: () => 'THE_UUID',
  });

  const getFailedDeps = (): UnitResolverDeps => ({
    hashGenerator: (_param: string) => Promise.reject(`ERROR`),
    tableName: 'UNIT_TABLE_NAME',
    docClient: new DynamoDB.DocumentClient(),
    uuidGenerator: () => 'THE_UUID',
  });

  const fixtureNoPassword: CrudApi.CreateUnitInput = {
    ...unitFixture.unitBase,
    chainId: 'CHAINID',
    groupId: 'GROUPID',
  };

  const fixtureWithPassword: CrudApi.CreateUnitInput = {
    ...unitFixture.unitBase,
    chainId: 'CHAINID',
    groupId: 'GROUPID',
    pos: {
      type: CrudApi.PosType.rkeeper,
      rkeeper: {
        endpointUri: 'ENDPOINT',
        rkeeperUsername: 'USERNAME',
        rkeeperPassword: 'PASSWORD',
        anyuppUsername: 'ANYUPPUSERNAME',
        anyuppPassword: 'PASSWORD2',
        restaurantId: 'RESTAURANTID',
      },
    },
  };

  const cases = [fixtureNoPassword, fixtureWithPassword];

  test.each(cases)('createUnitResolver tests', async fixture => {
    const deps: UnitResolverDeps = getDeps();

    const putSpy = jest.spyOn(deps.docClient, 'put');
    const updateSpy = jest.spyOn(deps.docClient, 'update');

    expect(await createUnitResolver(deps)(fixture).toPromise()).toEqual(true);
    expect(putSpy.mock.calls).toMatchSnapshot('PUT CALL');
    expect(updateSpy).not.toHaveBeenCalled();

    const failedDeps = getFailedDeps();
    expect(createUnitResolver(failedDeps)(fixture).toPromise()).rejects.toEqual(
      'ERROR',
    );
  });

  test.each(cases)('updateUnitResolver tests', async fixture => {
    const deps: UnitResolverDeps = getDeps();
    const putSpy = jest.spyOn(deps.docClient, 'put');
    const updateSpy = jest.spyOn(deps.docClient, 'update');

    expect(
      await updateUnitResolver(deps)({ ...fixture, id: 'ID' }).toPromise(),
    ).toEqual(true);
    expect(updateSpy.mock.calls).toMatchSnapshot('PUT CALL');
    expect(putSpy).not.toHaveBeenCalled();

    const failedDeps = getFailedDeps();
    expect(createUnitResolver(failedDeps)(fixture).toPromise()).rejects.toEqual(
      'ERROR',
    );
  });
});
