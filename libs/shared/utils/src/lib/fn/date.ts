export const timezoneBudapest = 'Europe/Budapest';
export const timezoneLondon = 'Europe/London';
export const timezoneUSCentral = 'US/Central';
export const timezoneNewYork = 'America/New_York';
import { DateTime } from 'luxon';
import { DateIntervals } from '@bgap/shared/types';

export const getDayIntervals = (
  dateValue: string | number,
  timeZone: string,
): DateIntervals => {
  const date: DateTime = DateTime.fromISO(new Date(dateValue).toISOString(), {
    zone: timeZone,
  });

  return {
    from: date.startOf('day').valueOf(),
    to: date.endOf('day').valueOf(),
  };
};
