import * as CrudApi from '@bgap/crud-gql/api';
import { Maybe } from '@bgap/crud-gql/api';
import {
  defaultSupportedOrderModes,
  defaultSupportedServingModes,
} from '@bgap/shared/types';
import {
  filterNullishGraphqlListWithDefault,
  throwIfEmptyValue,
} from '@bgap/shared/utils';
import * as geolib from 'geolib';
import { combineLatest, EMPTY, Observable, of } from 'rxjs';
import { catchError, defaultIfEmpty, map, switchMap } from 'rxjs/operators';
import {
  filterOutNotOpenUnits,
  getUnitOpeningHoursAtTime,
} from '../unit.utils';

type ListResponse<T> = {
  items: Array<T>;
  nextToken?: string;
};

export const getUnitsInRadius =
  (location: CrudApi.LocationInput) =>
  (crudSdk: CrudApi.CrudSdk): Observable<ListResponse<CrudApi.GeoUnit>> => {
    return listActiveUnits()(crudSdk).pipe(
      catchError(err => of(err)),
      filterNullishGraphqlListWithDefault<CrudApi.Unit>([]),
      map(units => filterOutNotOpenUnits({ units })),
      switchMap(units =>
        combineLatest(
          units.map(unit =>
            getChain(unit.chainId)(crudSdk).pipe(
              switchMap(chain => (chain.isActive ? of(chain) : EMPTY)),
              switchMap(chain =>
                getGroupCurrency(unit.groupId)(crudSdk).pipe(
                  map(currency => ({ chain, currency })),
                ),
              ),
              map(props =>
                toGeoUnit({
                  unit,
                  currency: props.currency,
                  inputLocation: location,
                  chainStyle: props.chain.style,
                  paymentModes: unit.paymentModes ? [...unit.paymentModes] : [],
                }),
              ),
              defaultIfEmpty({} as CrudApi.GeoUnit),
            ),
          ),
        ),
      ),
      map(items =>
        items
          .filter(x => !!x.id) // Filter out the {} that comes for the e not active chains
          .sort((a, b) => (a.distance > b.distance ? 1 : -1)),
      ),
      map(x => ({ items: x })),
    );
  };

const toGeoUnit = ({
  unit,
  currency,
  inputLocation,
  chainStyle,
  //openingHours,
  paymentModes,
}: {
  unit: CrudApi.Unit;
  currency: string;
  inputLocation: CrudApi.LocationInput;
  chainStyle: CrudApi.ChainStyle;
  //openingHours: WeeklySchedule;
  paymentModes?: Maybe<CrudApi.PaymentMode>[];
}): CrudApi.GeoUnit => ({
  id: unit.id,
  groupId: unit.groupId,
  chainId: unit.chainId,
  name: unit.name,
  address: unit.address,
  style: chainStyle,
  currency,
  distance: geolib.getDistance(unit.address.location, inputLocation),
  paymentModes: paymentModes,
  isAcceptingOrders: unit.isAcceptingOrders,
  openingHours: '09:00-22:00',
  openingHoursNext7: getUnitOpeningHoursAtTime(unit),
  supportedOrderModes:
    unit.supportedOrderModes && unit.supportedOrderModes.length > 0
      ? unit.supportedOrderModes
      : defaultSupportedOrderModes,
  supportedServingModes:
    unit.supportedServingModes && unit.supportedServingModes.length > 0
      ? unit.supportedServingModes
      : defaultSupportedServingModes,
});

/*const getOpeningOursForToday = (openingHours: WeeklySchedule): string => {
  console.log(
    '### ~ file: get-units-in-radius.resolver.ts ~ line 118 ~ TODO: use real opening hours insted of the fix one',
    openingHours,
  );
  return '09:00 - 22:00';
};
*/
const listActiveUnits = () => (crudSdk: CrudApi.CrudSdk) =>
  crudSdk.ListUnits(
    { filter: { isActive: { eq: true } } },
    { fetchPolicy: 'no-cache' },
  );

const getGroupCurrency =
  (id: string) =>
  (crudSdk: CrudApi.CrudSdk): Observable<string> =>
    crudSdk.GetGroupCurrency({ id }, { fetchPolicy: 'no-cache' }).pipe(
      // pipeDebug(`### getGroupCurrency by groupId: ${id}`),
      throwIfEmptyValue<{ currency: string }>(),
      map(currency => currency.currency),
    );

const getChain =
  (id: string) =>
  (crudSdk: CrudApi.CrudSdk): Observable<CrudApi.Chain> =>
    crudSdk
      .GetChain({ id }, { fetchPolicy: 'no-cache' })
      .pipe(throwIfEmptyValue<CrudApi.Chain>());
