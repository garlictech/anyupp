import {
  CustomDailySchedule,
  DateInterval,
  OpeningHoursByDate,
  Unit,
  WeeklySchedule,
} from '@bgap/domain';
import { findLast } from 'lodash/fp';
import { DateTime } from 'luxon';

const dateFormat = 'y-MM-dd';

export const getUnitTimeZone = (unit: Unit): string =>
  unit.timeZone || 'Europe/Budapest';

export const filterOutNotOpenUnits = ({
  units,
  atUtcTimeISO = DateTime.utc().toISO(),
}: {
  units: Array<Unit>;
  atUtcTimeISO?: string;
}): Array<Unit> =>
  units.filter(
    isUnitOpenAtTime(
      DateTime.fromISO(atUtcTimeISO, {
        zone: 'utc',
      }),
    ),
  );

const isUnitOpenAtTime =
  (atUtcTime: DateTime) =>
  (unit: Unit): boolean => {
    const unitTimeZone = getUnitTimeZone(unit);

    /** Millisecunds from the open.FROM in the units timeZone or a time in the past because the open field is optional */
    const from = unit.open?.from
      ? DateTime.fromISO(unit.open?.from, { zone: unitTimeZone }).toMillis()
      : 0;
    /** Millisecunds from the open.TO in the units timeZone or a time in the future because the open field is optional */
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
  openingHours: OpeningHoursByDate;
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
): keyInput is keyof WeeklySchedule => {
  return ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].includes(keyInput);
};
const isOfTypeDateInterval = (input: unknown): input is DateInterval => {
  return (
    input instanceof Object &&
    Object.keys(input).reduce(
      (prev, curr) => prev && ['from', 'to'].includes(curr),
      <boolean>true,
    )
  );
};

const getCustomDailyScheduleForADate = (
  openingHours: WeeklySchedule | null | undefined,
  dateString: string,
) => {
  if (!openingHours || !openingHours.custom) {
    return undefined;
  }

  return findLast(
    (schedule: CustomDailySchedule) => schedule.date === dateString,
  )(openingHours.custom);
};

export const getWeekDayNameFromDate = (
  date: DateTime,
): keyof WeeklySchedule => {
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
  unit: Unit,
): OpeningHoursByDate => {
  const unitTimeZone = getUnitTimeZone(unit);
  // Creating the date in the unit's timezone
  const date: DateTime = DateTime.fromISO(dateString, { zone: unitTimeZone });
  const weekDayName = getWeekDayNameFromDate(date);

  const closedResponse: OpeningHoursByDate = {
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

/**
 * Get the next 7 opening hours
 * The first day could be yesterday
 *
 * @param unit
 * @param time exact UTC time
 * @returns An array with daily opening hours
 */
export const getUnitOpeningHoursAtTime = (
  unit: Unit,
  time: DateTime = DateTime.utc(),
): Array<OpeningHoursByDate> => {
  const yesterday = time.minus({ days: 1 });
  const today = time;
  const openingHoursYesterday = getOpeningHoursAtDate(
    yesterday.toFormat(dateFormat),
    unit,
  );
  const openingHoursToday = getOpeningHoursAtDate(
    today.toFormat(dateFormat),
    unit,
  );

  const isYesterdayOpeningHoursStillActive = isTimeInOpeningHours({
    atUtcTime: time,
    openingHours: openingHoursYesterday,
  });

  const isTodayOpeningHoursActive = isTimeInOpeningHours({
    atUtcTime: time,
    openingHours: openingHoursToday,
  });

  let firstActiveDate;
  let actualOpeningHours: OpeningHoursByDate;

  if (isYesterdayOpeningHoursStillActive) {
    firstActiveDate = yesterday;
    actualOpeningHours = openingHoursYesterday;
  } else {
    firstActiveDate = today;
    actualOpeningHours = openingHoursToday;
    if (!isTodayOpeningHoursActive) {
      actualOpeningHours.closed = true;
      if (openingHoursToday.to && openingHoursToday.to <= time.toMillis()) {
        // AFTER Opening hours
        delete actualOpeningHours.from;
        delete actualOpeningHours.to;
      }
    }
  }

  return [
    actualOpeningHours,
    getOpeningHoursAtDate(
      firstActiveDate.plus({ days: 1 }).toFormat(dateFormat),
      unit,
    ),
    getOpeningHoursAtDate(
      firstActiveDate.plus({ days: 2 }).toFormat(dateFormat),
      unit,
    ),
    getOpeningHoursAtDate(
      firstActiveDate.plus({ days: 3 }).toFormat(dateFormat),
      unit,
    ),
    getOpeningHoursAtDate(
      firstActiveDate.plus({ days: 4 }).toFormat(dateFormat),
      unit,
    ),
    getOpeningHoursAtDate(
      firstActiveDate.plus({ days: 5 }).toFormat(dateFormat),
      unit,
    ),
    getOpeningHoursAtDate(
      firstActiveDate.plus({ days: 6 }).toFormat(dateFormat),
      unit,
    ),
  ];
};
