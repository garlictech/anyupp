import { GeoSearchableObjectType } from '@bgap/domain';
import { tap } from 'rxjs/operators';
import { searchByRadiusResolver } from './search-resolvers';

test('All the parameters are specified', done => {
  const deps = {
    osClient: {
      search: jest.fn().mockReturnValue(
        Promise.resolve({
          body: {
            hits: {
              total: {
                value: 10,
              },
              hits: [
                {
                  _source: {
                    id: 'RETURNED_ID',
                  },
                  sort: [12345],
                },
              ],
            },
          },
        }),
      ),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  searchByRadiusResolver(deps)({
    input: {
      location: { lat: 1.0, lon: 2.0 },
      radiusInMeters: 1200,
      objectType: GeoSearchableObjectType.unit,
      limit: 3,
      nextToken: '[4]',
    },
  })
    .pipe(
      tap(res => {
        expect(res).toMatchSnapshot('RESULT');
        expect(deps.osClient.search.mock.calls).toMatchSnapshot('SEARCH CALLS');
      }),
    )

    .subscribe(() => done());
});

test('Default parameters', done => {
  const deps = {
    osClient: {
      search: jest.fn().mockReturnValue(
        Promise.resolve({
          body: {
            hits: {
              hits: [
                {
                  _source: {
                    id: 'RETURNED_ID',
                  },
                },
              ],
            },
          },
        }),
      ),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  searchByRadiusResolver(deps)({
    input: {
      location: { lat: 1.0, lon: 2.0 },
      radiusInMeters: 1200,
      objectType: GeoSearchableObjectType.unit,
    },
  })
    .pipe(
      tap(res => {
        expect(res).toMatchSnapshot('RESULT');
        expect(deps.osClient.search.mock.calls).toMatchSnapshot('SEARCH CALLS');
      }),
    )

    .subscribe(() => done());
});
