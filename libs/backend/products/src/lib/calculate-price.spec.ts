import { DateTime } from 'luxon';
import { EVariantAvailabilityType } from '@bgap/shared/types';
import { calculatePriceFromAvailabilities } from './calculate-price';
import { Availability } from '@bgap/domain';

describe('calculatePriceFromAvailabilities method', () => {
  const availability_ALWAYS: Availability = {
    dayFrom: '',
    dayTo: '',
    price: 2.2,
    timeFrom: '',
    timeTo: '',
    type: EVariantAvailabilityType.ALWAYS,
  };
  const availability_SEASONAL: Availability = {
    dayFrom: '1970-01-01',
    dayTo: '1971-01-01',
    price: 999,
    timeFrom: '00:00',
    timeTo: '23:59',
    type: EVariantAvailabilityType.SEASONAL,
  };
  const availability_WEEKLY: Availability = {
    dayFrom: 'WEDNESDAY',
    dayTo: 'FRIDAY',
    price: 1.8,
    timeFrom: '11:00',
    timeTo: '14:00',
    type: EVariantAvailabilityType.WEEKLY,
  };
  const weeklyNotActiveTime: DateTime = DateTime.fromISO('10:00');
  const weeklyActiveTime: DateTime = DateTime.fromISO('2020-07-16T13:00'); // THURSDAY
  const seasonalNotActiveTime: DateTime = DateTime.fromISO('2000');
  const seasonalActiveTime: DateTime = DateTime.fromISO('1970-02-01');

  const allAvailabilityActiveTime: DateTime =
    DateTime.fromISO('1970-02-05T12:00');

  it('should use the ALWAYS availability if there is no other', () => {
    const availabilities: Availability[] = [availability_ALWAYS];
    const atTime = DateTime.utc();
    expect(calculatePriceFromAvailabilities(availabilities, atTime)).toEqual(
      2.2,
    );
  });

  it('should return undefined in case the availibility is empty', () => {
    const availabilities: Availability[] = [];
    const atTime = DateTime.utc();
    expect(calculatePriceFromAvailabilities(availabilities, atTime)).toEqual(
      undefined,
    );
  });

  it('should return undefined in case the availibility is missing', () => {
    const atTime = DateTime.utc();
    expect(calculatePriceFromAvailabilities(null, atTime)).toEqual(undefined);
  });

  describe('SEASONAL availability', () => {
    it('should filter out the not active SEASONAL with timezones', () => {
      // Availability in the defined timeZone
      const av: Availability = {
        dayFrom: '1970-02-02',
        dayTo: '1970-03-03',
        price: 999,
        timeFrom: '12:00',
        timeTo: '12:00',
        type: EVariantAvailabilityType.SEASONAL,
      };

      const checkTimezone = (zone: string) => {
        const func = calculatePriceFromAvailabilities;
        expect(
          func([av], DateTime.fromISO('1970-02-02T11:00', { zone })),
        ).toBeUndefined();
        expect(
          func([av], DateTime.fromISO('1970-02-02T11:59:59', { zone })),
        ).toBeUndefined();
        //-------------------------------------FROM-TIME--------1970-02-02 12:00:00---------------------------
        expect(
          func([av], DateTime.fromISO('1970-02-02T12:00:00', { zone })),
        ).toEqual(999); // at Start time
        expect(
          func([av], DateTime.fromISO('1970-02-02T12:00:01', { zone })),
        ).toEqual(999);
        expect(
          func([av], DateTime.fromISO('1970-02-02T12:01', { zone })),
        ).toEqual(999);
        expect(
          func([av], DateTime.fromISO('1970-02-03T12:00', { zone })),
        ).toEqual(999);
        expect(
          func([av], DateTime.fromISO('1970-03-01T12:00', { zone })),
        ).toEqual(999);
        expect(
          func([av], DateTime.fromISO('1970-03-03T11:59:59', { zone })),
        ).toEqual(999);
        //-------------------------------------TO-TIME----------1970-03-03 12:00:00---------------------------
        expect(
          func([av], DateTime.fromISO('1970-03-03T12:00:00', { zone })),
        ).toBeUndefined(); // at End time
        expect(
          func([av], DateTime.fromISO('1970-03-03T12:00:01', { zone })),
        ).toBeUndefined();
        expect(
          func([av], DateTime.fromISO('1970-03-03T12:01', { zone })),
        ).toBeUndefined();
        expect(
          func([av], DateTime.fromISO('1970-03-04T12:00', { zone })),
        ).toBeUndefined();
      };
      checkTimezone('Indian/Kerguelen');
      checkTimezone('Europe/Budapest');
      checkTimezone('Europe/London');
      checkTimezone('America/New_York');
    });

    it('should return undefined in case the only availability is a NOT active SEASONAL', () => {
      const availabilities: Availability[] = [availability_SEASONAL];
      const atTime = seasonalNotActiveTime;
      expect(
        calculatePriceFromAvailabilities(availabilities, atTime),
      ).toBeUndefined();
    });

    it('should use the active SEASONAL availability if there is no other', () => {
      const availabilities: Availability[] = [availability_SEASONAL];
      const atTime = seasonalActiveTime;
      expect(calculatePriceFromAvailabilities(availabilities, atTime)).toEqual(
        999,
      );
    });
  });
  describe('WEEKLY availability', () => {
    it('should filter out not active WEEKLY availabilities', () => {
      const av: Availability = {
        dayFrom: 'WEDNESDAY',
        dayTo: 'FRIDAY',
        price: 1.8,
        timeFrom: '11:00',
        timeTo: '14:00',
        type: EVariantAvailabilityType.WEEKLY,
      };
      const func = calculatePriceFromAvailabilities;
      const checkActiveDay = (date: string, zone: string) => {
        expect(
          func([av], DateTime.fromISO(`${date}T01:30`, { zone })),
        ).toBeUndefined();
        expect(
          func([av], DateTime.fromISO(`${date}T03:30`, { zone })),
        ).toBeUndefined();
        expect(
          func([av], DateTime.fromISO(`${date}T10:00`, { zone })),
        ).toBeUndefined();
        expect(
          func([av], DateTime.fromISO(`${date}T10:59:59`, { zone })),
        ).toBeUndefined();
        //-------------------------------------FROM-TIME--------11:00:00------------------------------
        expect(
          func([av], DateTime.fromISO(`${date}T11:00:00`, { zone })),
        ).toEqual(1.8); // at Start time
        expect(
          func([av], DateTime.fromISO(`${date}T11:00:01`, { zone })),
        ).toEqual(1.8);
        expect(func([av], DateTime.fromISO(`${date}T11:01`, { zone }))).toEqual(
          1.8,
        );
        expect(func([av], DateTime.fromISO(`${date}T12:30`, { zone }))).toEqual(
          1.8,
        );
        expect(
          func([av], DateTime.fromISO(`${date}T13:59:59`, { zone })),
        ).toEqual(1.8);
        //-------------------------------------TO-TIME----------14:00:00--------------------------
        expect(
          func([av], DateTime.fromISO(`${date}T14:00:00`, { zone })),
        ).toBeUndefined(); // at End time
        expect(
          func([av], DateTime.fromISO(`${date}T14:00:01`, { zone })),
        ).toBeUndefined();
        expect(
          func([av], DateTime.fromISO(`${date}T14:01`, { zone })),
        ).toBeUndefined();
        expect(
          func([av], DateTime.fromISO(`${date}T22:30`, { zone })),
        ).toBeUndefined();
        expect(
          func([av], DateTime.fromISO(`${date}T23:30`, { zone })),
        ).toBeUndefined();
      };
      const checkNotActiveDay = (date: string) => {
        expect(func([av], DateTime.fromISO(`${date}T10:00`))).toBeUndefined();
        //-------------------------------------FROM-TIME--------11:00:00------------------------------
        expect(func([av], DateTime.fromISO(`${date}T12:00`))).toBeUndefined();
        //-------------------------------------TO-TIME----------14:00:00--------------------------
        expect(func([av], DateTime.fromISO(`${date}T15:00`))).toBeUndefined();
      };
      checkNotActiveDay('2020-07-14'); // TUESDAY
      checkActiveDay('2020-07-16', 'America/New_York'); // THURSDAY
      checkActiveDay('2020-07-16', 'Europe/London'); // THURSDAY
      checkNotActiveDay('2020-07-18'); // SATURDAY
      //------------------------------------------------------(-1 WEEK)---------------------------
      checkNotActiveDay('2020-07-20'); // MONDAY
      checkNotActiveDay('2020-07-21'); // TUESDAY
      checkActiveDay('2020-07-22', 'America/New_York'); // WEDNESDAY
      checkActiveDay('2020-07-22', 'Europe/London'); // WEDNESDAY
      checkActiveDay('2020-07-23', 'America/New_York'); // THURSDAY
      checkActiveDay('2020-07-23', 'Europe/London'); // THURSDAY
      checkActiveDay('2020-07-24', 'America/New_York'); // FRIDAY
      checkActiveDay('2020-07-24', 'Europe/London'); // FRIDAY
      checkNotActiveDay('2020-07-25'); // SATURDAY
      checkNotActiveDay('2020-07-26'); // SUNDAY
      //------------------------------------------------------(+1 WEEK)---------------------------
      checkNotActiveDay('2020-07-28'); // TUESDAY
      checkActiveDay('2020-07-30', 'America/New_York'); // THURSDAY
      checkActiveDay('2020-07-30', 'Europe/London'); // THURSDAY
      checkNotActiveDay('2020-08-01'); // SATURDAY
    });

    it('should return undefined in case the only availability is a NOT active WEEKLY', () => {
      const availabilities: Availability[] = [availability_WEEKLY];
      const atTime = weeklyNotActiveTime;
      expect(
        calculatePriceFromAvailabilities(availabilities, atTime),
      ).toBeUndefined();
    });
    it('should use the active WEEKLY availability if there is no other', () => {
      const availabilities: Availability[] = [availability_WEEKLY];
      const atTime = weeklyActiveTime;
      expect(calculatePriceFromAvailabilities(availabilities, atTime)).toEqual(
        1.8,
      );
    });
  });

  describe('Combined availability check', () => {
    it('should return the lovest price from the active avalibilities', () => {
      expect(
        calculatePriceFromAvailabilities(
          [
            { ...availability_ALWAYS, price: 1 },
            { ...availability_WEEKLY, price: 20 },
            { ...availability_SEASONAL, price: 30 },
          ],
          allAvailabilityActiveTime,
        ),
      ).toEqual(1);
      expect(
        calculatePriceFromAvailabilities(
          [
            { ...availability_ALWAYS, price: 10 },
            { ...availability_WEEKLY, price: 20 },
            { ...availability_SEASONAL, price: 3 },
          ],
          allAvailabilityActiveTime,
        ),
      ).toEqual(3);
      expect(
        calculatePriceFromAvailabilities(
          [
            { ...availability_ALWAYS, price: 10 },
            { ...availability_WEEKLY, price: 2 },
            { ...availability_SEASONAL, price: 30 },
          ],
          allAvailabilityActiveTime,
        ),
      ).toEqual(2);
    });
  });
});
