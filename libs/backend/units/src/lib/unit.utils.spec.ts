import { timezoneBudapest, timezoneLondon } from '@bgap/shared/utils';
import { unitFixture } from '@bgap/shared/fixtures';
import { DateTime } from 'luxon';
import {
  filterOutNotOpenUnits,
  getOpeningHoursAtDate,
  getUnitOpeningHoursAtTime,
  getWeekDayNameFromDate,
  isTimeInOpeningHours,
} from './unit.utils';
import { Address, OpeningHoursByDate, Unit } from '@bgap/domain';

// USE THIS TIMESTAMP converter to check the timestamps if it is needed https://www.epochconverter.com/#tools
// it can handle timezones too

const unitBase: Unit = {
  ...unitFixture.unitBase,
  id: 'unitId',
  createdAt: '',
  updatedAt: '',
};

const addressInLondon: Address = {
  address: 'Bridge Street',
  city: 'London',
  country: 'Egyesült Királyság',
  title: 'BB',
  postalCode: 'SW1A 0AA',
  location: {
    lat: 51.5287718,
    lng: -0.2416802,
  },
};
const pluckId = (unit: Unit) => unit.id;

describe('Unit utils', () => {
  describe('filterOutCurrentlyNotOpenUnits function', () => {
    // THIS IS NOT for THE DAILY OPENING HOURS
    it('should filter out the NOT open units simple case with current time', () => {
      const openUnit_01_openEnded: Unit = {
        ...unitBase,
        id: 'openUnit_01_openEnded',
      };
      const openUnit_02_inInterval: Unit = {
        ...unitBase,
        id: 'openUnit_02_inInterval',
        open: { from: '1970-01-01', to: '2100-01-01' }, // these are in the units timezone
      };
      const openUnit_03_openStarted: Unit = {
        ...unitBase,
        id: 'openUnit_03_openStarted',
        open: { to: '2100-01-01', from: '2100-01-01' },
      };
      const openUnit_04_allways: Unit = {
        ...unitBase,
        id: 'openUnit_04_allways',
        open: null,
      };
      const closedUnit_01_beforeFrom: Unit = {
        ...unitBase,
        id: 'closedUnit_01_beforeFrom',
        open: { from: '2100-01-01' },
      };
      const closedUnit_02_beforeFrom: Unit = {
        ...unitBase,
        id: 'closedUnit_02_beforeFrom',
        open: { from: '2100-01-01', to: '2200-01-01' },
      };
      const closedUnit_01_afterTo: Unit = {
        ...unitBase,
        id: 'closedUnit_01_afterTo',
        open: { to: '2000-10-01' },
      };
      const closedUnit_02_afterTo: Unit = {
        ...unitBase,
        id: 'closedUnit_02_afterTo',
        open: { from: '2000-01-01', to: '2020-01-03' },
      };
      expect(
        filterOutNotOpenUnits({
          units: [
            openUnit_01_openEnded,
            openUnit_02_inInterval,
            openUnit_03_openStarted,
            openUnit_04_allways,
            closedUnit_01_beforeFrom,
            closedUnit_02_beforeFrom,
            closedUnit_01_afterTo,
            closedUnit_02_afterTo,
          ],
        }).map(pluckId),
      ).toMatchSnapshot();
    });

    describe("using the unit's timezone", () => {
      const open_0405 = { from: '2100-01-04', to: '2100-01-05' };
      const open_0506 = { from: '2100-01-05', to: '2100-01-06' };
      const unit_0405_inLondon: Unit = {
        ...unitBase,
        id: 'unit_0405_inLondon',
        address: addressInLondon,
        open: open_0405,
        timeZone: timezoneLondon,
      };
      const unit_0506_inLondon: Unit = {
        ...unitBase,
        id: 'unit_0506_inLondon',
        address: addressInLondon,
        open: open_0506,
        timeZone: timezoneLondon,
      };
      const unit_0405_inBudapest: Unit = {
        ...unitBase,
        id: 'unit_0405_inBudapest',
        open: open_0405,
        timeZone: timezoneBudapest,
      };
      const unit_0506_inBudapest: Unit = {
        ...unitBase,
        id: 'unit_0506_inBudapest',
        open: open_0506,
        timeZone: timezoneBudapest,
      };
      const units = [
        unit_0405_inLondon,
        unit_0506_inLondon,
        unit_0405_inBudapest,
        unit_0506_inBudapest,
      ];

      describe('using London time', () => {
        it('should filter out every unit before 04', () => {
          expect(
            filterOutNotOpenUnits({
              units,
              atUtcTimeISO: DateTime.fromISO('2100-01-03T20:00', {
                zone: timezoneLondon,
              }).toISO(),
            }).map(pluckId),
          ).toEqual([]);
        });
        it('should filter out LONDON that will be open only on 04', () => {
          expect(
            filterOutNotOpenUnits({
              units,
              atUtcTimeISO: DateTime.fromISO('2100-01-03T23:59', {
                // in BP this is 2100-01-04T00:59
                zone: timezoneLondon,
              }).toISO(),
            }).map(pluckId),
          ).toEqual([unit_0405_inBudapest.id]);
        });
        it('should NOT filter out LONDON that will be open only on 04', () => {
          expect(
            filterOutNotOpenUnits({
              units,
              atUtcTimeISO: DateTime.fromISO('2100-01-04T00:00', {
                zone: timezoneLondon,
              }).toISO(),
            }).map(pluckId),
          ).toEqual([unit_0405_inLondon.id, unit_0405_inBudapest.id]);
        });
        it('should return all on 05', () => {
          expect(
            filterOutNotOpenUnits({
              units,
              atUtcTimeISO: DateTime.fromISO('2100-01-05T00:01', {
                // in BP this is 05-T01:01
                zone: timezoneLondon,
              }).toISO(),
            }).map(pluckId),
          ).toEqual([
            unit_0405_inLondon.id,
            unit_0506_inLondon.id,
            unit_0405_inBudapest.id,
            unit_0506_inBudapest.id,
          ]);
        });
        it('should filter out BUDAPEST that will be closed on 06', () => {
          expect(
            filterOutNotOpenUnits({
              units,
              atUtcTimeISO: DateTime.fromISO('2100-01-05T23:01', {
                zone: timezoneLondon,
              }).toISO(),
            }).map(pluckId),
          ).toEqual([
            unit_0405_inLondon.id,
            unit_0506_inLondon.id,
            unit_0506_inBudapest.id,
          ]);
        });
        it('should filter out BOTH that will be closed on 06', () => {
          expect(
            filterOutNotOpenUnits({
              units,
              atUtcTimeISO: DateTime.fromISO('2100-01-06T00:01', {
                zone: timezoneLondon,
              }).toISO(),
            }).map(pluckId),
          ).toEqual([unit_0506_inLondon.id, unit_0506_inBudapest.id]);
        });
        it('should filter out every unit after 06', () => {
          expect(
            filterOutNotOpenUnits({
              units,
              atUtcTimeISO: DateTime.fromISO('2100-01-07T00:00', {
                zone: timezoneLondon,
              }).toISO(),
            }).map(pluckId),
          ).toEqual([]);
        });

        describe('fixed time different timezones', () => {
          it('should NOT filter out BUDAPEST or LONDON in case the time in Budapest is 2100-01-06T23:30', () => {
            expect(
              filterOutNotOpenUnits({
                units,
                atUtcTimeISO: DateTime.fromISO('2100-01-06T23:30', {
                  zone: timezoneBudapest,
                }).toISO(),
              }).map(pluckId),
            ).toEqual([unit_0506_inLondon.id, unit_0506_inBudapest.id]);
          });
          it('should filter out BUDAPEST but NOT LONDON in case the time in London is 2100-01-06T23:30', () => {
            expect(
              filterOutNotOpenUnits({
                units,
                atUtcTimeISO: DateTime.fromISO('2100-01-06T23:30', {
                  zone: timezoneLondon,
                }).toISO(),
              }).map(pluckId),
            ).toEqual([unit_0506_inLondon.id]);
          });
        });
      });
    });
  });

  describe('getWeekDayNameFromDate function', () => {
    it('should return the names of all the weekdays in the desired format', () => {
      expect(getWeekDayNameFromDate(DateTime.utc(2021, 7, 13))).toEqual('tue');
      expect(getWeekDayNameFromDate(DateTime.fromISO('2021-07-14'))).toEqual(
        'wed',
      );
      expect(getWeekDayNameFromDate(DateTime.fromISO('2021-07-15'))).toEqual(
        'thu',
      );
      expect(getWeekDayNameFromDate(DateTime.fromISO('2021-07-16'))).toEqual(
        'fri',
      );
      expect(getWeekDayNameFromDate(DateTime.fromISO('2021-07-17'))).toEqual(
        'sat',
      );
      expect(getWeekDayNameFromDate(DateTime.fromISO('2021-07-18'))).toEqual(
        'sun',
      );
    });
  });

  describe('getOpeningHoursAtDate function', () => {
    const unit_inBudapest: Unit = {
      ...unitBase,
      openingHours: {
        mon: {
          from: '09:00',
          to: '17:00',
        },
        tue: {
          from: '09:00',
          to: '18:00',
        },
        wed: {
          from: '09:00',
          to: '19:00',
        },
      },
      timeZone: timezoneBudapest,
    };
    const unit_inLondon: Unit = {
      ...unit_inBudapest,
      address: addressInLondon,
      timeZone: timezoneLondon,
    };
    it('should return the opening hours for the given day with the Unit in Budapest', () => {
      const tuesday = '2021-07-13';
      expect(getOpeningHoursAtDate(tuesday, unit_inBudapest))
        .toMatchInlineSnapshot(`
        Object {
          "closed": false,
          "date": "2021-07-13",
          "from": 1626159600000,
          "to": 1626192000000,
        }
      `);
      const wednesday = '2021-07-14';
      expect(getOpeningHoursAtDate(wednesday, unit_inBudapest))
        .toMatchInlineSnapshot(`
        Object {
          "closed": false,
          "date": "2021-07-14",
          "from": 1626246000000,
          "to": 1626282000000,
        }
      `);
    });
    it('should return the opening hours for the given day with the Unit in London', () => {
      const tuesday = '2021-07-13';
      expect(getOpeningHoursAtDate(tuesday, unit_inLondon))
        .toMatchInlineSnapshot(`
        Object {
          "closed": false,
          "date": "2021-07-13",
          "from": 1626163200000,
          "to": 1626195600000,
        }
      `);
      const wednesday = '2021-07-14';
      expect(getOpeningHoursAtDate(wednesday, unit_inLondon))
        .toMatchInlineSnapshot(`
        Object {
          "closed": false,
          "date": "2021-07-14",
          "from": 1626249600000,
          "to": 1626285600000,
        }
      `);
    });

    it('should return the proper opening hours with custom schedule overrides', () => {
      const unit: Unit = {
        ...unitBase,
        openingHours: {
          mon: {
            // This will be overriden by a custom schedule
            from: '09:00',
            to: '17:00',
          },
          custom: [
            {
              date: '2021-07-13',
              from: '00:00',
              to: '00:30',
            },
            {
              date: '2021-07-12', // This will be overriden by the last schedule on that day
              from: '09:00',
              to: '09:30',
            },
            {
              date: '2021-07-12', // THIS should be the active one
              from: '11:00',
              to: '15:30',
            },
            {
              date: '2021-07-10',
              from: '00:00',
              to: '00:30',
            },
          ],
        },
      };
      const monday = '2021-07-12';
      expect(getOpeningHoursAtDate(monday, unit)).toMatchInlineSnapshot(`
        Object {
          "closed": false,
          "date": "2021-07-12",
          "from": 1626080400000,
          "to": 1626096600000,
        }
      `);
    });

    it('should return the custom schedule in case there is not any default for that day', () => {
      const unit: Unit = {
        ...unitBase,
        openingHours: {
          mon: undefined,
          custom: [
            {
              date: '2021-07-12',
              from: '11:00',
              to: '15:30',
            },
          ],
        },
      };
      const monday = '2021-07-12';
      expect(getOpeningHoursAtDate(monday, unit)).toMatchInlineSnapshot(`
        Object {
          "closed": false,
          "date": "2021-07-12",
          "from": 1626080400000,
          "to": 1626096600000,
        }
      `);
    });

    it('should return CLOSED for the given date in case there is no opening hours for that day', () => {
      const unit: Unit = {
        ...unitBase,
        openingHours: {
          mon: undefined,
        },
      };
      const monday = '2021-07-12';
      expect(getOpeningHoursAtDate(monday, unit)).toMatchInlineSnapshot(`
        Object {
          "closed": true,
          "date": "2021-07-12",
        }
      `);
    });
    it('should return CLOSED for the given date in case there is no opening hours at all', () => {
      const unit: Unit = {
        ...unitBase,
        openingHours: {
          mon: {
            // This will be overriden by a custom schedule
            from: '09:00',
            to: '17:00',
          },
          custom: [
            {
              date: '2021-07-12',
              from: '',
              to: '',
            },
          ],
        },
      };
      const monday = '2021-07-12';
      expect(getOpeningHoursAtDate(monday, unit)).toMatchInlineSnapshot(`
        Object {
          "closed": true,
          "date": "2021-07-12",
        }
      `);
    });
    it('should return CLOSED for the given date in case there is default opening ours BUT the custom one overrides it', () => {
      const unit: Unit = {
        ...unitBase,
        openingHours: undefined,
      };
      const monday = '2021-07-12';
      expect(getOpeningHoursAtDate(monday, unit)).toMatchInlineSnapshot(`
        Object {
          "closed": true,
          "date": "2021-07-12",
        }
      `);
    });
    it('should return tomorrow as the TO timestamp in case the to part of the time interval is before the from', () => {
      const unit: Unit = {
        ...unitBase,
        openingHours: {
          mon: {
            from: '18:00',
            to: '04:00',
          },
        },
      };
      const monday = '2021-07-12';
      expect(getOpeningHoursAtDate(monday, unit)).toMatchInlineSnapshot(`
        Object {
          "closed": false,
          "date": "2021-07-12",
          "from": 1626105600000,
          "to": 1626141600000,
        }
      `);
    });
  });

  describe('isTimeInOpeningHours function', () => {
    it('should return FALSE for a closed openingHours input', () => {
      // const op = {
      //   '2021-07-12': {
      //     from: 1626184800000,
      //     to: 1626134400000,
      //   },
      // }
      const openingHours_closed: OpeningHoursByDate = {
        closed: true,
        date: 'NOT IMPORTANT',
      };
      expect(
        isTimeInOpeningHours({
          atUtcTime: DateTime.utc(),
          openingHours: openingHours_closed,
        }),
      ).toEqual(false);
    });
    it('should return FALSE in case the given time is outside the given openingHours', () => {
      const openingHours_open: OpeningHoursByDate = {
        date: '2021-07-12',
        from: DateTime.fromISO('2021-07-12T12:00', {
          zone: timezoneBudapest,
        }).toMillis(),
        to: DateTime.fromISO('2021-07-12T14:00', {
          zone: timezoneBudapest,
        }).toMillis(),
        closed: false,
      };

      expect(
        isTimeInOpeningHours({
          atUtcTime: DateTime.fromISO('2021-07-12T11:59', {
            zone: timezoneBudapest,
          }),
          openingHours: openingHours_open,
        }),
      ).toEqual(false);
    });
    it('should return TRUE in case the given time is in the openingHours input', () => {
      const openingHours_open: OpeningHoursByDate = {
        date: '2021-07-12',
        from: DateTime.fromISO('2021-07-12T12:00', {
          zone: timezoneBudapest,
        }).toMillis(),
        to: DateTime.fromISO('2021-07-12T14:00', {
          zone: timezoneBudapest,
        }).toMillis(),
        closed: false,
      };

      expect(
        isTimeInOpeningHours({
          atUtcTime: DateTime.fromISO('2021-07-12T12:00', {
            zone: timezoneBudapest,
          }),
          openingHours: openingHours_open,
        }),
      ).toEqual(true);
    });
  });

  describe('getUnitOpeningHoursFromTime function', () => {
    const unit: Unit = {
      ...unitBase,
      openingHours: {
        mon: {
          // 2021-07-12
          // will be overridden to CLOSED by a custom schedule
          from: '09:00',
          to: '17:00',
        },
        tue: {
          // 2021-07-13
          // will be overridden by a custom schedule
          from: '09:00',
          to: '18:00',
        },
        wed: {
          // 2021-07-14
          from: '09:00',
          to: '19:00',
        },
        thu: {
          // 2021-07-15
          from: '09:00',
          to: '20:00',
        },
        fri: {
          // 2021-07-16
          from: '09:00',
          to: '21:00',
        },
        sat: {
          // 2021-07-17
          // will be overridden by a custom schedule
          from: '',
          to: '',
        },
        sun: {
          // 2021-07-18
          from: '',
          to: '',
        },
        custom: [
          {
            date: '2021-07-12',
            from: '',
            to: '',
          },
          {
            date: '2021-07-13',
            from: '10:00',
            to: '19:30',
          },
          {
            date: '2021-07-17',
            from: '11:00',
            to: '14:00',
          },
        ],
      },
    };
    it('should return 7 opening hours', () => {
      expect(getUnitOpeningHoursAtTime(unit)).toHaveLength(7);
    });

    it('should return the proper opening hours for the next 7 days', () => {
      expect(
        getUnitOpeningHoursAtTime(
          unit,
          DateTime.fromISO('2021-07-12T09:08:34.123'),
        ),
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "closed": true,
            "date": "2021-07-12",
          },
          Object {
            "closed": false,
            "date": "2021-07-13",
            "from": 1626163200000,
            "to": 1626197400000,
          },
          Object {
            "closed": false,
            "date": "2021-07-14",
            "from": 1626246000000,
            "to": 1626282000000,
          },
          Object {
            "closed": false,
            "date": "2021-07-15",
            "from": 1626332400000,
            "to": 1626372000000,
          },
          Object {
            "closed": false,
            "date": "2021-07-16",
            "from": 1626418800000,
            "to": 1626462000000,
          },
          Object {
            "closed": false,
            "date": "2021-07-17",
            "from": 1626512400000,
            "to": 1626523200000,
          },
          Object {
            "closed": true,
            "date": "2021-07-18",
          },
        ]
      `);
    });

    it('should return CLOSED withOUT from, to fields for today in case we are AFTER the opening hours interval', () => {
      const unit = {
        ...unitBase,
        openingHours: {
          wed: {
            // 2021-07-14
            from: '09:00',
            to: '19:00',
          },
        },
      };

      const afterOpeningHours = DateTime.fromISO('2021-07-14T19:01', {
        zone: timezoneBudapest,
      });
      const responseAfterOpeningHours = getUnitOpeningHoursAtTime(
        unit,
        afterOpeningHours,
      );

      expect(responseAfterOpeningHours[0]).toEqual({
        date: '2021-07-14',
        closed: true,
      });
    });

    it('should return CLOSED with from, to fields for today in case we are BEFORE the opening hours interval', () => {
      const unit = {
        ...unitBase,
        openingHours: {
          wed: {
            // 2021-07-14
            from: '09:00',
            to: '19:00',
          },
        },
      };

      const beforeOpeningHours = DateTime.fromISO('2021-07-14T08:59', {
        zone: timezoneBudapest,
      });
      const responseBeforeOpeningHours = getUnitOpeningHoursAtTime(
        unit,
        beforeOpeningHours,
      );

      expect(responseBeforeOpeningHours[0]).toEqual({
        date: '2021-07-14',
        closed: true,
        from: DateTime.fromISO('2021-07-14T09:00', {
          zone: timezoneBudapest,
        }).toMillis(),
        to: DateTime.fromISO('2021-07-14T19:00', {
          zone: timezoneBudapest,
        }).toMillis(),
      });
    });

    it('the given time should NOT tigger the CLOSED state on the day AFTER today', () => {
      const unit = {
        ...unitBase,
        openingHours: {
          thu: {
            // 2021-07-15
            from: '10:00',
            to: '20:00',
          },
          fri: {
            // 2021-07-16
            from: '10:00',
            to: '20:00',
          },
        },
      };
      const wednesdayAfterOpeningHours = DateTime.fromISO('2021-07-14T20:01', {
        zone: timezoneBudapest,
      });
      const responseAfterOpeningHours = getUnitOpeningHoursAtTime(
        unit,
        wednesdayAfterOpeningHours,
      );

      // The Next day is NOT closed
      expect(responseAfterOpeningHours[1]).toEqual({
        closed: false,
        date: '2021-07-15', // Thuseday
        from: 1626336000000,
        to: 1626372000000,
      });
      // Nor the Next after
      expect(responseAfterOpeningHours[2]).toEqual({
        closed: false,
        date: '2021-07-16', // Friday
        from: 1626422400000,
        to: 1626458400000,
      });
    });

    it('should return CLOSED for the given date without from, to in case it has NO opening hours for the given date', () => {
      const unit = {
        ...unitBase,
      };
      const aDateWithoutOpeningHours = DateTime.fromISO('2021-07-14T12:00', {
        zone: timezoneBudapest,
      });
      const responseOpeningHours = getUnitOpeningHoursAtTime(
        unit,
        aDateWithoutOpeningHours,
      );

      expect(responseOpeningHours[0]).toEqual({
        closed: true,
        date: '2021-07-14',
      });
    });

    it('should return opening hours from the day before the requested day as the first, in case that is still active', () => {
      const getNext7ActiveOpeningHoursFromThusedayDawn = DateTime.fromISO(
        '2021-07-13T01:01',
        { zone: timezoneBudapest },
      );
      const unit: Unit = {
        ...unitBase,
        openingHours: {
          mon: {
            // 2021-07-12
            from: '16:00',
            to: '02:00',
          },
          tue: {
            // 2021-07-13
            from: '17:00',
            to: '03:00',
          },
        },
      };

      const response = getUnitOpeningHoursAtTime(
        unit,
        getNext7ActiveOpeningHoursFromThusedayDawn,
      );

      expect(response).toHaveLength(7);

      // we should return the opening hours from monday because that is the still active opening hours
      // so that should be the first
      expect(response[0]).toEqual({
        date: '2021-07-12',
        from: DateTime.fromISO('2021-07-12T16:00', {
          zone: timezoneBudapest,
        }).toMillis(),
        to: DateTime.fromISO('2021-07-13T02:00', {
          zone: timezoneBudapest,
        }).toMillis(),
        closed: false,
      });
      // The last opening hours is the 6th day's from the start day
      // because the first is from the day before the start day
      expect(response[6]).toEqual({
        closed: true,
        date: '2021-07-18',
      });
    });
  });
});
