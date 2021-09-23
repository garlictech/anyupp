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
    hashGenerator: (param: string) => `HASHED ${param}`,
    tableName: 'UNIT_TABLE_NAME',
    docClient: new DynamoDB.DocumentClient(),
    uuidGenerator: () => 'THE_UUID',
  });

  const getFailedDeps = (): UnitResolverDeps => ({
    hashGenerator: (_param: string) => {
      throw `ERROR`;
    },
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

    const putSpy = jest
      .spyOn(deps.docClient, 'put')
      .mockReturnValue({ promise: () => Promise.resolve('FULL OK') } as any);
    const updateSpy = jest
      .spyOn(deps.docClient, 'update')
      .mockReturnValue({ promise: () => Promise.resolve('FULL OK') } as any);

    expect(await createUnitResolver(deps)(fixture).toPromise()).toEqual(true);
    expect(putSpy.mock.calls).toMatchSnapshot('PUT CALL');
    expect(updateSpy).not.toHaveBeenCalled();

    const failedDeps = getFailedDeps();
    try {
      await createUnitResolver(failedDeps)(fixture).toPromise();
    } catch (err) {
      expect(err).toMatchSnapshot('ERROR');
    }
  });

  test.each(cases)('updateUnitResolver tests', async fixture => {
    const deps: UnitResolverDeps = getDeps();
    const putSpy = jest
      .spyOn(deps.docClient, 'put')
      .mockReturnValue({ promise: () => Promise.resolve('FULL OK') } as any);
    const updateSpy = jest
      .spyOn(deps.docClient, 'update')
      .mockReturnValue({ promise: () => Promise.resolve('FULL OK') } as any);

    expect(
      await updateUnitResolver(deps)({ ...fixture, id: 'THE_ID' }).toPromise(),
    ).toEqual(true);
    expect(updateSpy.mock.calls).toMatchSnapshot('UPDATE CALL');
    expect(putSpy).not.toHaveBeenCalled();

    const failedDeps = getFailedDeps();
    try {
      await createUnitResolver(failedDeps)(fixture).toPromise();
    } catch (err) {
      expect(err).toMatchSnapshot('ERROR');
    }
  });
});
