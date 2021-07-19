import * as AnyuppApi from '@bgap/anyupp-gql/api';
import * as CrudApi from '@bgap/crud-gql/api';
import { findLast } from 'lodash/fp';
import { DateTime } from 'luxon';
import { getTimezoneFromLocation } from '../date.utils';

const dateFormat = 'y-MM-dd';

export const filterOutNotOpenUnits = ({
  units,
  atUtcTimeISO = DateTime.utc().toISO(),
}: {
  units: Array<CrudApi.Unit>;
  atUtcTimeISO?: string;
}): Array<CrudApi.Unit> =>
  units.filter(
    isUnitOpenAtTime(
      DateTime.fromISO(atUtcTimeISO, {
        zone: 'utc',
      }),
    ),
  );

const isUnitOpenAtTime =
  (atUtcTime: DateTime) =>
  (unit: CrudApi.Unit): boolean => {
    const unitTimeZone = getUnitTimeZone(unit);

    /** Millisecunds from the open.FROM in the units timeZone or a time in the past */
    const from = unit.open?.from
      ? DateTime.fromISO(unit.open?.from, { zone: unitTimeZone }).toMillis()
      : 0;
    /** Millisecunds from the open.TO in the units timeZone or a time in the future */
    const to = unit.open?.to
      ? DateTime.fromISO(unit.open?.to, { zone: unitTimeZone })
          .endOf('day')
          .toMillis()
      : DateTime.fromISO('2999-01-01').toMillis();
    const atTimeMillis = atUtcTime.toMillis();
    return from <= atTimeMillis && atTimeMillis <= to;
  };
export const isTimeInOpeningHours = ({
  atUtcTime,
  openingHours,
}: {
  atUtcTime: DateTime;
  openingHours: AnyuppApi.OpeningHoursByDate;
}): boolean => {
  const atTimeMillis = atUtcTime.toMillis();

  if (openingHours.closed || !openingHours.from || !openingHours.to) {
    return false;
  }

  const from = openingHours.from;
  const to = openingHours.to;

  return from <= atTimeMillis && atTimeMillis <= to;
};

const getDatetimeHoursMinutesFromString = (time: string | null | undefined) => {
  const [hour, minute] = (time || '0:0').split(':');
  if (!hour && !minute) {
    return { hour: 0, minute: 0 };
  }

  return { hour: parseInt(hour), minute: parseInt(minute) };
};

const isOfTypeWeeklyScheduleKeys = (
  keyInput: string,
): keyInput is keyof CrudApi.WeeklySchedule => {
  return ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].includes(keyInput);
};
const isOfTypeDateInterval = (
  input: unknown,
): input is CrudApi.DateInterval => {
  return (
    input instanceof Object &&
    Object.keys(input).reduce(
      (prev, curr) => prev && ['from', 'to'].includes(curr),
      <boolean>true,
    )
  );
};

const getCustomDailyScheduleForADate = (
  openingHours: CrudApi.WeeklySchedule | null | undefined,
  dateString: string,
) => {
  if (!openingHours || !openingHours.custom) {
    return undefined;
  }

  return findLast(
    (schedule: CrudApi.CustomDailySchedule) => schedule.date === dateString,
  )(openingHours.custom);
};

export const getWeekDayNameFromDate = (
  date: DateTime,
): keyof CrudApi.WeeklySchedule => {
  const weekDayName: string = date.toFormat('EEE').toLocaleLowerCase();
  if (!weekDayName || !isOfTypeWeeklyScheduleKeys(weekDayName)) {
    throw 'Week day name parse error on date: ' + date.toISO();
  }
  return weekDayName;
};

/**
 * Calculates the opening hours of the given Unit on the given date using the unit's timezone
 *
 * @param date string representation of a date e.q.: 2021-07-13
 * @param unit The unit to get the opening hours from it contains the timezone too
 */
export const getOpeningHoursAtDate = (
  dateString: string,
  unit: CrudApi.Unit,
): AnyuppApi.OpeningHoursByDate => {
  const unitTimeZone = getUnitTimeZone(unit);
  // Creating the date in the unit's timezone
  const date: DateTime = DateTime.fromISO(dateString, { zone: unitTimeZone });
  const weekDayName = getWeekDayNameFromDate(date);

  const closedResponse: AnyuppApi.OpeningHoursByDate = {
    date: date.toFormat(dateFormat),
    closed: true,
  };

  if (!unit.openingHours) {
    return closedResponse;
  }

  let fromTime: string | null | undefined;
  let toTime: string | null | undefined;

  const customScheduloOnThatDay = getCustomDailyScheduleForADate(
    unit.openingHours,
    dateString,
  );
  if (customScheduloOnThatDay) {
    fromTime = customScheduloOnThatDay.from;
    toTime = customScheduloOnThatDay.to;
  } else {
    const defaultOpeningHoursOnThatDay = unit.openingHours[weekDayName];

    if (
      defaultOpeningHoursOnThatDay &&
      isOfTypeDateInterval(defaultOpeningHoursOnThatDay)
    ) {
      fromTime = defaultOpeningHoursOnThatDay.from;
      toTime = defaultOpeningHoursOnThatDay.to;
    }
  }

  if (!fromTime || !toTime) {
    return closedResponse;
  }

  const from = date.set(getDatetimeHoursMinutesFromString(fromTime)).toMillis();
  let to = date.set(getDatetimeHoursMinutesFromString(toTime)).toMillis();
  if (to < from) {
    to += 86400000; // Add + 1 day because the to is in the next day
  }

  return {
    date: date.toFormat(dateFormat),
    from,
    to,
    closed: false,
  };
};

export const getUnitOpeningHoursAtTime = (
  unit: CrudApi.Unit,
  time: DateTime = DateTime.utc(),
): Array<AnyuppApi.OpeningHoursByDate> => {
  const yesterday = time.minus({ day: 1 });
  const today = time;

  const openingHoursYesterday = getOpeningHoursAtDate(
    yesterday.toFormat(dateFormat),
    unit,
  );
  const firstActiveDate = isTimeInOpeningHours({
    atUtcTime: time,
    openingHours: openingHoursYesterday,
  })
    ? yesterday
    : today;

  return [
    getOpeningHoursAtDate(firstActiveDate.toFormat(dateFormat), unit),
    getOpeningHoursAtDate(
      firstActiveDate.plus({ day: 1 }).toFormat(dateFormat),
      unit,
    ),
    getOpeningHoursAtDate(
      firstActiveDate.plus({ day: 2 }).toFormat(dateFormat),
      unit,
    ),
    getOpeningHoursAtDate(
      firstActiveDate.plus({ day: 3 }).toFormat(dateFormat),
      unit,
    ),
    getOpeningHoursAtDate(
      firstActiveDate.plus({ day: 4 }).toFormat(dateFormat),
      unit,
    ),
    getOpeningHoursAtDate(
      firstActiveDate.plus({ day: 5 }).toFormat(dateFormat),
      unit,
    ),
    getOpeningHoursAtDate(
      firstActiveDate.plus({ day: 6 }).toFormat(dateFormat),
      unit,
    ),
  ];
};

export const getUnitTimeZone = (unit: CrudApi.Unit): string =>
  getTimezoneFromLocation(unit.address.location);
