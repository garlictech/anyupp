import * as geolib from 'geolib';
import * as fp from 'lodash/fp';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { AmplifyApi, AmplifyApiQueryDocuments } from '@bgap/admin/amplify-api';
import { AppsyncApi } from '@bgap/api/graphql/schema';
import { removeTypeNameField } from '@bgap/api/utils';
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
import {
  validateChain,
  validateGetGroupCurrency,
  validateUnit,
} from '@bgap/shared/data-validators';
// import { pipeDebug } from '@bgap/shared/utils';

type listResponse<T> = {
  items: Array<T>;
};

// TODO: add GEO_SEARCH
export const getUnitsInRadius = ({
  location,
  amplifyGraphQlClient,
}: {
  location: AmplifyApi.LocationInput;
  amplifyGraphQlClient: GraphqlApiClient;
}): Observable<listResponse<AppsyncApi.GeoUnit>> => {
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
    // filter(fp.negate(fp.isEmpty)),
    // switchMap((units: Array<IUnit>) =>
    switchMap(units =>
      combineLatest(
        units.map(unit =>
          getChain(amplifyGraphQlClient, unit.chainId).pipe(
            filter(chain => chain.isActive),
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
          ),
        ),
      ),
    ),
    map(items => items.sort((a, b) => (a.distance > b.distance ? 1 : -1))),
    // pipeDebug('### getUnitsInRadius'),
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
  inputLocation: AppsyncApi.LocationInput;
  chainStyle: IChainStyle;
  openingHours: IWeeklySchedule;
  paymentModes: IPaymentMode[];
}): AppsyncApi.GeoUnit => ({
  id: unit.id,
  groupId: unit.groupId,
  chainId: unit.chainId,
  name: unit.name,
  address: removeTypeNameField(unit.address),
  style: removeTypeNameField(chainStyle),
  currency,
  distance: geolib.getDistance(unit.address.location, inputLocation),
  openingHours: getOpeningOursForToday(openingHours),
  // paymentModes: paymentModes as AppsyncApi.PaymentMode[],
  paymentModes: paymentModes as any,
});

const getOpeningOursForToday = (openingHours: IWeeklySchedule): string => {
  return '09:00 - 22:00';
};

const listActiveUnits = (
  amplifyApiClient: GraphqlApiClient,
): Observable<Array<IUnit>> => {
  const input: AmplifyApi.ListUnitsQueryVariables = {
    filter: { isActive: { eq: true } },
  };
  return executeQuery(amplifyApiClient)<AmplifyApi.ListUnitsQuery>(
    AmplifyApiQueryDocuments.listUnits,
    input,
  ).pipe(
    map(x => x.listUnits?.items),
    filter(fp.negate(fp.isEmpty)),
    switchMap((items: []) => combineLatest(items.map(validateUnit))),
  );
};

const getGroupCurrency = (
  amplifyApiClient: GraphqlApiClient,
  id: string,
): Observable<string> => {
  return executeQuery(amplifyApiClient)<AmplifyApi.GetGroupQuery>(
    AmplifyApiQueryDocuments.getGroupCurrency,
    { id },
  ).pipe(
    map(x => x.getGroup),
    switchMap(validateGetGroupCurrency),
    map(x => x.currency),
  );
};

const getChain = (
  amplifyApiClient: GraphqlApiClient,
  id: string,
): Observable<IChain> => {
  return executeQuery(amplifyApiClient)<AmplifyApi.GetChainQuery>(
    AmplifyApiQueryDocuments.getChain,
    { id },
  ).pipe(
    map(x => x.getChain),
    // pipeDebug(`### GET CHAIN with id: ${id}`),
    switchMap(validateChain),
  );
};
