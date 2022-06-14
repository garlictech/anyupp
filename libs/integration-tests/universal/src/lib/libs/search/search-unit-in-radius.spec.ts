const { createConnector } = require('aws-elasticsearch-js');
import { Client } from '@elastic/elasticsearch';
import { switchMap, tap, delay } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { createIamCrudSdk } from '../../../api-clients';
import { CrudApiConfig } from '@bgap/crud-gql/api';
import { searchByRadiusResolver } from '@bgap/backend/search';
import { GeoSearchableObjectType } from '@bgap/domain';

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
}, 60000);

beforeAll(done => {
  cleanup$
    .pipe(
      switchMap(() =>
        sdk.CreateUnit({
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
              location: {
                lat: 47,
                lng: 19,
              },
            },
            chainId: 'CHAINID',
            groupId: 'GROUPID',
            isAcceptingOrders: true,
            isActive: true,
            name: 'NAME',
          },
        }),
      ),
      delay(3000),
    )
    .subscribe(() => done());
}, 60000);

test('Search for a unit in radius using resolver', done => {
  searchByRadiusResolver(searchDeps)({
    input: {
      location: { lat: 1, lon: 1 },
      radiusInMeters: 100,
      objectType: GeoSearchableObjectType.unit,
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
            objectType: GeoSearchableObjectType.unit,
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
            objectType: GeoSearchableObjectType.unit,
            limit: 1,
          },
        }),
      ),
      // Should not find unit in an empty area
      tap(res => expect(res.items).toEqual([])),
    )
    .subscribe(() => done());
}, 60000);

test('Search for a unit in radius using API', done => {
  sdk
    .SearchByRadius({
      input: {
        location: { lat: 1, lon: 1 },
        radiusInMeters: 100,
        objectType: GeoSearchableObjectType.unit,
        limit: 1,
      },
    })
    .pipe(tap(res => expect(res?.items).toEqual([unitId])))
    .subscribe(() => done());
}, 60000);
