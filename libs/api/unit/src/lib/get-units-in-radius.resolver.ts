import { AmplifyApi, AmplifyApiQueryDocuments } from '@bgap/admin/amplify-api';
import {
  executeQuery,
  GraphqlApiClient,
} from '@bgap/shared/graphql/api-client';
import {
  IChainStyle,
  IUnit,
  validateGetGroupCurrency,
  IWeeklySchedule,
  IPaymentMode,
} from '@bgap/shared/types';
import * as fp from 'lodash/fp';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, filter } from 'rxjs/operators';
import { pipeDebug } from '@bgap/shared/utils';
import { AppsyncApi } from '@bgap/api/graphql/schema';
import { validateUnit } from '@bgap/shared/types';
import * as geolib from 'geolib';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Observable<listResponse<AppsyncApi.GeoUnit>> => {
  console.log(
    '### ~ file: getUnitsinRadius.resolver.ts ~ line 39 ~ INPUT PARAMS',
    JSON.stringify({
      location,
    }),
    undefined,
    2,
  );

  // TODO: use geoSearch for the units
  return listActiveUnits(amplifyGraphQlClient).pipe(
    // filter(fp.negate(fp.isEmpty)),
    // switchMap((units: Array<IUnit>) =>
    switchMap(units =>
      combineLatest(
        units
          // .filter(isUnit)
          .map(unit =>
            getGroupCurrency(amplifyGraphQlClient, unit.groupId).pipe(
              map(currency =>
                toGeoUnit({
                  unit,
                  currency,
                  inputLocation: location,
                  chainStyle: {} as any,
                  openingHours: {},
                  paymentModes: {} as any,
                }),
              ),
            ),
          ),
      ),
    ),
    map(items => items.sort((a, b) => (a.distance > b.distance ? 1 : -1))),
    pipeDebug('### getUnitsInRadius'),
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
  address: unit.address as any,
  style: chainStyle as any,
  currency,
  distance: geolib.getDistance(
    {
      latitude: unit.address.location.lat.toString(),
      longitude: unit.address.location.lng.toString(),
    },
    {
      latitude: inputLocation.lat.toString(),
      longitude: inputLocation.lng.toString(),
    },
  ),
  // distance: geolib.getDistance(unit.address.location, inputLocation),
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
