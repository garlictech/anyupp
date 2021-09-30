import { throwIfEmptyValue } from '@bgap/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { Maybe } from '@bgap/crud-gql/api';
import { filterNullishGraphqlListWithDefault } from '@bgap/shared/utils';
import * as geolib from 'geolib';
import { combineLatest, EMPTY, Observable, of } from 'rxjs';
import { defaultIfEmpty, map, switchMap } from 'rxjs/operators';
import { filterOutNotOpenUnits, getUnitOpeningHoursAtTime } from '../../utils';
import { UnitsResolverDeps } from './utils';

type ListResponse<T> = {
  items: Array<T>;
  nextToken?: string;
};

export const getUnitsInRadius =
  (location: CrudApi.LocationInput) =>
  (deps: UnitsResolverDeps): Observable<ListResponse<CrudApi.GeoUnit>> => {
    return listActiveUnits()(deps).pipe(
      filterNullishGraphqlListWithDefault<CrudApi.Unit>([]),
      map(units => filterOutNotOpenUnits({ units })),
      switchMap(units =>
        combineLatest(
          units.map(unit =>
            getChain(unit.chainId)(deps).pipe(
              switchMap(chain => (chain.isActive ? of(chain) : EMPTY)),
              switchMap(chain =>
                getGroupCurrency(unit.groupId)(deps).pipe(
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
  //openingHours: IWeeklySchedule;
  paymentModes?: Maybe<CrudApi.PaymentMode>[];
}): CrudApi.GeoUnit => ({
  id: unit.id,
  groupId: unit.groupId,
  chainId: unit.chainId,
  name: unit.name,
  address: unit.address || {},
  style: chainStyle,
  currency,
  distance: geolib.getDistance(unit.address.location, inputLocation),
  paymentModes: paymentModes,
  isAcceptingOrders: unit.isAcceptingOrders,
  openingHours: '09:00-22:00',
  openingHoursNext7: getUnitOpeningHoursAtTime(unit),
  supportedOrderModes: unit.supportedOrderModes,
  supportedServingModes: unit.supportedServingModes,
});

/*const getOpeningOursForToday = (openingHours: IWeeklySchedule): string => {
  console.log(
    '### ~ file: get-units-in-radius.resolver.ts ~ line 118 ~ TODO: use real opening hours insted of the fix one',
    openingHours,
  );
  return '09:00 - 22:00';
};
*/
const listActiveUnits = () => (deps: UnitsResolverDeps) =>
  deps.crudSdk.ListUnits(
    { filter: { isActive: { eq: true } } },
    { fetchPolicy: 'no-cache' },
  );

const getGroupCurrency =
  (id: string) =>
  (deps: UnitsResolverDeps): Observable<string> =>
    deps.crudSdk.GetGroupCurrency({ id }, { fetchPolicy: 'no-cache' }).pipe(
      // pipeDebug(`### getGroupCurrency by groupId: ${id}`),
      throwIfEmptyValue<{ currency: string }>(),
      map(currency => currency.currency),
    );

const getChain =
  (id: string) =>
  (deps: UnitsResolverDeps): Observable<CrudApi.Chain> =>
    deps.crudSdk
      .GetChain({ id }, { fetchPolicy: 'no-cache' })
      .pipe(throwIfEmptyValue<CrudApi.Chain>());
