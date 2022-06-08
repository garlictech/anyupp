import { EVariantAvailabilityType } from '@bgap/shared/types';
import { DateTime } from 'luxon';
import {
  getSeasonalAvailabilityFromTime,
  getSeasonalAvailabilityToTime,
  WEEK_DAYS,
} from '@bgap/anyupp-backend-lib';
import { Availability, Maybe } from '@bgap/domain';

/**
 *
 * @param availabilities
 * @param atTime DateTime object with Zone information at when and in what timeZone the price will be calculated
 * usually this in the Unit's timezone
 */
export const calculatePriceFromAvailabilities = (
  availabilities: Maybe<Maybe<Availability>[]> | undefined,
  atTime: DateTime,
): number | undefined => {
  if (!availabilities) {
    return undefined;
  }

  const price: number | undefined = availabilities
    .filter(isAvailabilityActiveAtTime(atTime))
    .map(a => {
      if (a?.price === null || a?.price === undefined) {
        throw new Error('HANDLE ME: price is null');
      }

      return Number(a.price);
    })
    .sort((a, b) => (a < b ? 1 : -1)) // Order by price, the cheapest is the preferred
    .pop();

  if (price === undefined) {
    return undefined;
  }

  return price;
};

const isAvailabilityActiveAtTime =
  (atTime: DateTime) => (availability: Maybe<Availability>) => {
    return (
      availability &&
      (availability.type === EVariantAvailabilityType.ALWAYS ||
        (availability.type === EVariantAvailabilityType.SEASONAL &&
          isSeasonalActive(availability, atTime)) ||
        (availability.type === EVariantAvailabilityType.WEEKLY &&
          isWeeklyActive(availability, atTime)))
    );
  };

// Seasonal availability uses absolute times that is in the Unit's timezone
// => the calculation should use the timezone information because the atTime comes from the server
// and the server is NOT in the Unit's timezone
const isSeasonalActive = (
  availability: Availability,
  atTime: DateTime,
): boolean => {
  if (
    availability.type !== EVariantAvailabilityType.SEASONAL ||
    availability.dayFrom === undefined ||
    availability.timeFrom === undefined ||
    availability.dayTo === undefined ||
    availability.timeTo === undefined
  ) {
    return false;
  }
  const fromTime = getSeasonalAvailabilityFromTime(
    availability,
    atTime.zoneName,
  );
  const toTime = getSeasonalAvailabilityToTime(availability, atTime.zoneName);
  return fromTime <= atTime && atTime < toTime;
};

// Weekly availability uses relative times
// it is in the Unit's timezone and the atTime's weekday and hour values are in the same timezone as the Unit
// => the calculation don't need the timezone information
export const isWeeklyActive = (
  availability: Availability,
  atTime: DateTime,
): boolean => {
  return (
    inDayWindow(availability, atTime) && inTimeWindow(availability, atTime)
  );
};

export const inDayWindow = (
  availability: Availability,
  atTime: DateTime,
): boolean => {
  if (
    availability.type !== EVariantAvailabilityType.WEEKLY ||
    availability.dayFrom === undefined ||
    availability.dayFrom === null ||
    availability.dayTo === undefined ||
    availability.dayTo === null
  ) {
    return false;
  }

  const atDay = atTime.weekday;
  const fromDay = WEEK_DAYS[availability.dayFrom];
  const toDay = WEEK_DAYS[availability.dayTo];
  if (atDay < fromDay || toDay < atDay) {
    return false;
  }
  return true;
};

export const inTimeWindow = (
  availability: Availability,
  atTime: DateTime,
): boolean => {
  if (
    availability.type !== EVariantAvailabilityType.WEEKLY ||
    availability.timeFrom === undefined ||
    availability.timeTo === undefined ||
    availability.timeFrom === null ||
    availability.timeTo === null
  ) {
    return false;
  }

  const atHourMin =
    atTime.hour.toString().padStart(2, '0') +
    ':' +
    atTime.minute.toString().padStart(2, '0');
  const fromHourMin = availability.timeFrom;
  const toHourMin = availability.timeTo;
  if (atHourMin < fromHourMin || toHourMin <= atHourMin) {
    return false;
  }
  return true;
};
