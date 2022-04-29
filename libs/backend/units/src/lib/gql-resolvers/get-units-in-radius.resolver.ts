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
import { combineLatest, EMPTY, forkJoin, Observable, of } from 'rxjs';
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
  (location: CrudApi.LocationInputOld) =>
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
                forkJoin([
                  getGroupCurrency(unit.groupId)(crudSdk).pipe(
                    map(currency => ({ chain, currency })),
                  ),
                  getGroup(unit.groupId)(crudSdk),
                ]),
              ),
              map(([props, group]) =>
                toGeoUnit({
                  unit,
                  group,
                  chain: props.chain,
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
  group,
  chain,
  currency,
  inputLocation,
  chainStyle,
  paymentModes,
}: {
  unit: CrudApi.Unit;
  group: CrudApi.Group;
  chain: CrudApi.Chain;
  currency: string;
  inputLocation: CrudApi.LocationInputOld;
  chainStyle: CrudApi.ChainStyle;
  paymentModes?: Maybe<CrudApi.PaymentMode>[];
}): CrudApi.GeoUnit => ({
  id: unit.id,
  groupId: unit.groupId,
  chainId: unit.chainId,
  unit,
  chain,
  group,
  name: unit.name,
  address: unit.address,
  isAcceptingOrders: unit.isAcceptingOrders,
  orderPolicy: unit.orderPolicy,
  serviceFeePolicy: unit.serviceFeePolicy,
  ratingPolicies: unit.ratingPolicies,
  tipPolicy: unit.tipPolicy,
  soldOutVisibilityPolicy: unit.soldOutVisibilityPolicy,
  style: chainStyle,
  currency,
  distance: geolib.getDistance(
    {
      lat: unit.address.location?.lat || unit.location?.lat || 0,
      lng: unit.address.location?.lon || unit.location?.lng || 0,
    },
    inputLocation,
  ),
  paymentModes: paymentModes,
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
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const listActiveUnits = () => (crudSdk: CrudApi.CrudSdk) =>
  crudSdk.SearchUnits({ filter: { isActive: { eq: true } } });

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

const getGroup =
  (id: string) =>
  (crudSdk: CrudApi.CrudSdk): Observable<CrudApi.Group> =>
    crudSdk
      .GetGroup({ id }, { fetchPolicy: 'no-cache' })
      .pipe(throwIfEmptyValue<CrudApi.Group>());
