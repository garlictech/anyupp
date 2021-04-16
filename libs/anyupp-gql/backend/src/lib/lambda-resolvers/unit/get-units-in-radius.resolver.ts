import * as geolib from 'geolib';
import * as fp from 'lodash/fp';
import { combineLatest, EMPTY, iif, Observable, of } from 'rxjs';
import { defaultIfEmpty, filter, map, switchMap } from 'rxjs/operators';

import { CrudApi, CrudApiQueryDocuments } from '@bgap/crud-gql/api';
import * as AnyuppApi from '@bgap/anyupp-gql/api';
import {
  validateChain,
  validateGetGroupCurrency,
  validateUnit,
} from '@bgap/shared/data-validators';
import {
  executeQuery,
  GraphqlApiClient,
} from '@bgap/shared/graphql/api-client';
import {
  IChain,
  IChainStyle,
  IPaymentMode,
  IUnit,
  IWeeklySchedule,
} from '@bgap/shared/types';
import { removeTypeNameField } from '../../utils/graphql.utils';

type listResponse<T> = {
  items: Array<T>;
};

// TODO: add GEO_SEARCH
export const getUnitsInRadius = ({
  location,
  amplifyGraphQlClient,
}: {
  location: CrudApi.LocationInput;
  amplifyGraphQlClient: GraphqlApiClient;
}): Observable<listResponse<AnyuppApi.GeoUnit>> => {
  // console.log(
  //   '### ~ file: getUnitsinRadius.resolver.ts ~ line 39 ~ INPUT PARAMS',
  //   JSON.stringify({
  //     location,
  //   }),
  //   undefined,
  //   2,
  // );

  // TODO: use geoSearch for the units
  return listActiveUnits(amplifyGraphQlClient).pipe(
    switchMap(units =>
      combineLatest(
        units.map(unit =>
          getChain(amplifyGraphQlClient, unit.chainId).pipe(
            switchMap(chain => iif(() => chain.isActive, of(chain), EMPTY)),
            switchMap(chain =>
              getGroupCurrency(amplifyGraphQlClient, unit.groupId).pipe(
                map(currency => ({ chain, currency })),
              ),
            ),
            map(props =>
              toGeoUnit({
                unit,
                currency: props.currency,
                inputLocation: location,
                chainStyle: props.chain.style,
                openingHours: {},
                paymentModes: unit.paymentModes as any,
              }),
            ),
            defaultIfEmpty({} as AnyuppApi.GeoUnit),
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
  openingHours,
  paymentModes,
}: {
  unit: IUnit;
  currency: string;
  inputLocation: AnyuppApi.LocationInput;
  chainStyle: IChainStyle;
  openingHours: IWeeklySchedule;
  paymentModes: IPaymentMode[];
}): AnyuppApi.GeoUnit => ({
  id: unit.id,
  groupId: unit.groupId,
  chainId: unit.chainId,
  name: unit.name,
  address: removeTypeNameField(unit.address),
  style: removeTypeNameField(chainStyle),
  currency,
  distance: geolib.getDistance(unit.address.location, inputLocation),
  openingHours: getOpeningOursForToday(/*openingHours*/),
  // paymentModes: paymentModes as AnyuppApi.PaymentMode[],
  paymentModes: paymentModes as any,
});

const getOpeningOursForToday = (/* openingHours: IWeeklySchedule */): string => {
  return '09:00 - 22:00';
};

const listActiveUnits = (
  amplifyApiClient: GraphqlApiClient,
): Observable<Array<IUnit>> => {
  const input: CrudApi.ListUnitsQueryVariables = {
    filter: { isActive: { eq: true } },
  };
  return executeQuery(amplifyApiClient)<CrudApi.ListUnitsQuery>(
    CrudApiQueryDocuments.listUnits,
    input,
  ).pipe(
    map(x => x.listUnits?.items),
    // pipeDebug('### LIST ACTIVE UNITS'),
    filter(fp.negate(fp.isEmpty)),
    switchMap((items: []) => combineLatest(items.map(validateUnit))),
  );
};

const getGroupCurrency = (
  amplifyApiClient: GraphqlApiClient,
  id: string,
): Observable<string> => {
  return executeQuery(amplifyApiClient)<CrudApi.GetGroupQuery>(
    CrudApiQueryDocuments.getGroupCurrency,
    { id },
  ).pipe(
    map(x => x.getGroup),
    // pipeDebug(`### GET GROUP with id: ${id}`),
    switchMap(validateGetGroupCurrency),
    map(x => x.currency),
  );
};

const getChain = (
  amplifyApiClient: GraphqlApiClient,
  id: string,
): Observable<IChain> => {
  return executeQuery(amplifyApiClient)<CrudApi.GetChainQuery>(
    CrudApiQueryDocuments.getChain,
    { id },
  ).pipe(
    map(x => x.getChain),
    // pipeDebug(`### GET CHAIN with id: ${id}`),
    switchMap(validateChain),
  );
};
