const { createConnector } = require('aws-elasticsearch-js');
import { Client } from '@elastic/elasticsearch';
import * as CrudApi from '@bgap/crud-gql/api';
import { switchMap, tap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { createIamCrudSdk } from '../../../api-clients';
import { CrudApiConfig } from '@bgap/crud-gql/api';
import { searchByRadiusResolver } from '@bgap/backend/search';

const unitId = '12-search-unit-in-radius-c86e6484-a2c7-11ec-b909-0242ac120002';

const searchDeps = {
  osClient: new Client({
    nodes: [CrudApiConfig.openSearchEndpoint],
    Connection: createConnector({ region: process.env.AWS_REGION || '' }),
  }),
};
const sdk = createIamCrudSdk();

const cleanup$ = forkJoin([sdk.DeleteUnit({ input: { id: unitId } })]);

afterAll(done => {
  cleanup$.subscribe(() => done());
});

beforeAll(done => {
  sdk
    .CreateUnit({
      input: {
        id: unitId,
        location: {
          lat: 1,
          lon: 1,
        },
        address: {
          address: 'ADDRESS',
          city: 'CITY',
          country: 'COUNTRY',
          postalCode: 'POSTALCODE',
          title: 'TITLE',
        },
        chainId: 'CHAINID',
        groupId: 'GROUPID',
        isAcceptingOrders: true,
        isActive: true,
        name: 'NAME',
      },
    })
    .subscribe(() => done());
});

test('Search for a unit in radius using resolver', done => {
  searchByRadiusResolver(searchDeps)({
    input: {
      location: { lat: 1, lon: 1 },
      radiusInMeters: 100,
      objectType: CrudApi.GeoSearchableObjectType.unit,
      limit: 1,
    },
  })
    .pipe(
      tap(res => expect(res.items).toEqual([unitId])),
      switchMap(res =>
        searchByRadiusResolver(searchDeps)({
          input: {
            location: { lat: 1, lon: 1 },
            radiusInMeters: 100,
            objectType: CrudApi.GeoSearchableObjectType.unit,
            limit: 1,
            nextToken: res.nextToken,
          },
        }),
      ),
      tap(res => expect(res.items).toEqual([])),
      switchMap(() =>
        searchByRadiusResolver(searchDeps)({
          input: {
            location: { lat: 2, lon: 2 },
            radiusInMeters: 100,
            objectType: CrudApi.GeoSearchableObjectType.unit,
            limit: 1,
          },
        }),
      ),
      // Should not find unit in an empty area
      tap(res => expect(res.items).toEqual([])),
    )
    .subscribe(() => done());
}, 20000);

test('Search for a unit in radius using API', done => {
  sdk
    .SearchByRadius({
      input: {
        location: { lat: 1, lon: 1 },
        radiusInMeters: 100,
        objectType: CrudApi.GeoSearchableObjectType.unit,
        limit: 1,
      },
    })
    .pipe(tap(res => expect(res?.items).toEqual([])))
    .subscribe(() => done());
});
