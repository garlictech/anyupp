import * as geolib from 'geolib';
import { CrudSdk } from '@bgap/crud-gql/api';
import { pipe } from 'fp-ts/lib/function';
import * as R from 'ramda';
import {
  GeoSearchableObjectType,
  GeoUnit,
  LocationLatLngInput,
} from '@bgap/domain';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

type ListResponse<T> = {
  items: Array<T>;
  nextToken?: string;
};

export const getUnitsInRadius =
  (location: LocationLatLngInput) =>
  (crudSdk: CrudSdk): Observable<ListResponse<GeoUnit>> =>
    crudSdk
      .SearchByRadius({
        input: {
          location: {
            lat: location.lat,
            lon: location.lng,
          },
          radiusInMeters: 50000,
          objectType: GeoSearchableObjectType.unit,
        },
      })
      .pipe(
        map(results => results?.items || []),
        switchMap(unitIds =>
          pipe(
            unitIds,
            x => R.reject(R.isNil)(x),
            R.map(unitId => crudSdk.GetUnit({ id: unitId })),
            x => forkJoin(x),
            map(items =>
              pipe(
                items,
                x => R.reject(R.isNil)(x),
                R.map(unit => ({
                  ...R.omit(['openingHours'])(unit),
                  openingHoursNext7: [],
                  groupId: 'NOGROUP',
                  chainId: 'NOCHAIN',
                  distance: geolib.getDistance(
                    {
                      lat:
                        unit.address.location?.lat || unit.location?.lat || 0,
                      lng:
                        unit.address.location?.lng || unit.location?.lon || 0,
                    },
                    location,
                  ),
                })),
                items => ({ items }),
              ),
            ),
          ),
        ),
      );
