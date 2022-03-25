import * as CrudApi from '@bgap/crud-gql/api';
import { delay, switchMap, tap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import * as R from 'ramda';
import { createIamCrudSdk } from '../../../api-clients';

const unitId = '12-search-unit-in-radius-c86e6484-a2c7-11ec-b909-0242ac120002';

const sdk = createIamCrudSdk();

const cleanup$ = forkJoin([sdk.DeleteUnit({ input: { id: unitId } })]);

afterAll(done => {
  cleanup$.subscribe(() => done());
});

test('Search for a unit in radius', done => {
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
    .pipe(
      delay(3000),
      switchMap(() =>
        sdk.SearchByRadius({
          input: {
            location: { lat: 1, lon: 1 },
            radiusInMeters: 100,
            objectType: CrudApi.GeoSearchableObjectType.unit,
            limit: 1,
          },
        }),
      ),
      tap(console.warn),
      /* tap(res =>
        expect(R.omit(['nextToken'], res)).toMatchSnapshot('SHOULD FIND unit'),
      ),
      switchMap(() =>
        sdk.SearchByRadius({
          input: {
            location: { lat: 2, lon: 2 },
            radiusInMeters: 100,
            objectType: CrudApi.GeoSearchableObjectType.unit,
            limit: 1,
          },
        }),
      ),
      tap(console.warn),
      tap(res =>
        expect(R.omit(['nextToken'], res)).toMatchSnapshot(
          'SHOULD NOT FIND unit',
        ),
      ),*/
    )
    .subscribe(() => done());
}, 20000);
