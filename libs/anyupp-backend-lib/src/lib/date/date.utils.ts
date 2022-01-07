import * as CrudApi from '@bgap/crud-gql/api';
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
