import { DateTime } from 'luxon';

import { Availability } from '@bgap/domain';

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
  availability: Availability,
  inTimeZone: string,
) =>
  DateTime.fromISO(`${availability.dayFrom}T${availability.timeFrom}`, {
    zone: inTimeZone,
  });

export const getSeasonalAvailabilityToTime = (
  availability: Availability,
  inTimeZone: string,
) =>
  DateTime.fromISO(`${availability.dayTo}T${availability.timeTo}`, {
    zone: inTimeZone,
  });
