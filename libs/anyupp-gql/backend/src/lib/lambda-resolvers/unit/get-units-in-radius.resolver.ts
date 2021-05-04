import * as geolib from 'geolib';
import * as fp from 'lodash/fp';
import { combineLatest, EMPTY, iif, Observable, of, throwError } from 'rxjs';
import {
  catchError,
  defaultIfEmpty,
  filter,
  map,
  switchMap,
} from 'rxjs/operators';

import { CrudApi, CrudApiQueryDocuments } from '@bgap/crud-gql/api';
import { AnyuppApi } from '@bgap/anyupp-gql/api';
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
import { removeTypeNameField } from '@bgap/shared/utils';

type listResponse<T> = {
  items: Array<T>;
};

// TODO: add GEO_SEARCH
export const getUnitsInRadius = ({
  location,
  crudGraphqlClient,
}: {
  location: CrudApi.LocationInput;
  crudGraphqlClient: GraphqlApiClient;
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
  return listActiveUnits(crudGraphqlClient).pipe(
    switchMap(units =>
      combineLatest(
        units.map(unit =>
          getChain(crudGraphqlClient, unit.chainId).pipe(
            switchMap(chain => iif(() => chain.isActive, of(chain), EMPTY)),
            switchMap(chain =>
              getGroupCurrency(crudGraphqlClient, unit.groupId).pipe(
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                paymentModes: unit.paymentModes as any, // TODO remove this any (CrudApi.paymentModes !== AnyuppApi.PaymentModes)
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
  openingHours: getOpeningOursForToday(openingHours),
  // paymentModes: paymentModes as AnyuppApi.PaymentMode[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paymentModes: paymentModes as any, // TODO remove this any (CrudApi.paymentModes !== AnyuppApi.PaymentModes)
});

const getOpeningOursForToday = (openingHours: IWeeklySchedule): string => {
  console.log(
    '### ~ file: get-units-in-radius.resolver.ts ~ line 118 ~ TODO: use real opening hours insted of the fix one',
    openingHours,
  );
  return '09:00 - 22:00';
};

const listActiveUnits = (
  crudGraphqlClient: GraphqlApiClient,
): Observable<Array<IUnit>> => {
  const input: CrudApi.ListUnitsQueryVariables = {
    filter: { isActive: { eq: true } },
  };
  return executeQuery(crudGraphqlClient)<CrudApi.ListUnitsQuery>(
    CrudApiQueryDocuments.listUnits,
    input,
  ).pipe(
    map(x => x.listUnits?.items),
    // pipeDebug('### LIST ACTIVE UNITS'),
    filter(fp.negate(fp.isEmpty)),
    switchMap((items: []) => combineLatest(items.map(validateUnit))),
    catchError(err => {
      console.error(err);
      return throwError('Internal listActiveUnits query error');
    }),
  );
};

const getGroupCurrency = (
  crudGraphqlClient: GraphqlApiClient,
  id: string,
): Observable<string> => {
  return executeQuery(crudGraphqlClient)<CrudApi.GetGroupQuery>(
    CrudApiQueryDocuments.getGroupCurrency,
    { id },
  ).pipe(
    map(x => x.getGroup),
    // pipeDebug(`### GET GROUP with id: ${id}`),
    switchMap(validateGetGroupCurrency),
    map(x => x.currency),
    catchError(err => {
      console.error(err);
      return throwError('Internal GroupCurrency query error');
    }),
  );
};

const getChain = (
  crudGraphqlClient: GraphqlApiClient,
  id: string,
): Observable<IChain> => {
  return executeQuery(crudGraphqlClient)<CrudApi.GetChainQuery>(
    CrudApiQueryDocuments.getChain,
    { id },
  ).pipe(
    map(x => x.getChain),
    // pipeDebug(`### GET CHAIN with id: ${id}`),
    switchMap(validateChain),
    catchError(err => {
      console.error(err);
      return throwError('Internal Chain query error');
    }),
  );
};
