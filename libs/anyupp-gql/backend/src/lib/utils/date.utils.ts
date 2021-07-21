// eslint-disable-next-line @typescript-eslint/no-var-requires
const geoTz = require('geo-tz');
import * as CrudApi from '@bgap/crud-gql/api';
import { ILocation } from '@bgap/shared/types';
import { DateTime } from 'luxon';

export const WEEK_DAYS: {
  MONDAY: number;
  TUESDAY: number;
  WEDNESDAY: number;
  THURSDAY: number;
  FRIDAY: number;
  SATURDAY: number;
  SUNDAY: number;
  [index: string]: number;
} = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,
};

export const getSeasonalAvailabilityFromTime = (
  availability: CrudApi.Availability,
  inTimeZone: string,
) =>
  DateTime.fromISO(`${availability.dayFrom}T${availability.timeFrom}`, {
    zone: inTimeZone,
  });
export const getSeasonalAvailabilityToTime = (
  availability: CrudApi.Availability,
  inTimeZone: string,
) =>
  DateTime.fromISO(`${availability.dayTo}T${availability.timeTo}`, {
    zone: inTimeZone,
  });

export const getTimezoneFromLocation = (
  location?: ILocation | null,
): string => {
  if (!location || (!location.lat && !location.lng)) {
    return 'Europe/Budapest';
  }

  return geoTz(location.lat, location.lng)[0];
};
