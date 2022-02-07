import { DateTime } from 'luxon';
import { timezoneLondon, timezoneBudapest, timezoneNewYork } from './date';

// Skipped because it is only experimenting with the Luxon DateTime and timezone management
// BUT it is really usefull, so please do NOT remove it
describe.skip('Luxon', () => {
  it('utc vs local', () => {
    // console.log(DateTime.utc());
    console.log('new Date().toString()', new Date().toString());
    console.log('new Date().toUTCString()', new Date().toUTCString());
    console.log('new Date().toISOString()', new Date().toISOString());
    console.log('DateTime.utc().toISO()', DateTime.utc().toISO());
    console.log('DateTime.local().toISO()', DateTime.local().toISO());
    console.log(
      "DateTime.fromISO(DateTime.local().toISO(), { zone: 'Europe/London' }).toISO()",
      DateTime.fromISO(DateTime.local().toISO(), {
        zone: timezoneLondon,
      }).toISO(),
    );
    console.log(
      "DateTime.local().setZone('Europe/London').toISO()",
      DateTime.local().setZone(timezoneLondon).toISO(),
    );
    console.log(
      "DateTime.utc().setZone('Europe/London').toISO()",
      DateTime.utc().setZone(timezoneLondon).toISO(),
    );
    console.log(
      "DateTime.fromISO('2020-07-27T13:46:39.348Z', {zone: 'utc'}).toISO()",
      DateTime.fromISO('2020-07-27T13:46:39.348Z', { zone: 'utc' }).toISO(),
      'offset:',
      DateTime.fromISO('2020-07-27T13:46:39.348Z', { zone: 'utc' }).offset,
    );
    console.log(
      "DateTime.fromISO('2020-07-27T13:46:39.348Z', { zone: 'Europe/London' }).toISO()",
      DateTime.fromISO('2020-07-27T13:46:39.348Z', {
        zone: timezoneLondon,
      }).toISO(),
      'offset:',
      DateTime.fromISO('2020-07-27T13:46:39.348Z', {
        zone: timezoneLondon,
      }).offset,
    );
    console.log(
      "DateTime.fromISO('2020-07-27T13:46:39.348Z', { zone: 'Europe/Budapest' }).toISO()",
      DateTime.fromISO('2020-07-27T13:46:39.348Z', {
        zone: timezoneBudapest,
      }).toISO(),
      'offset:',
      DateTime.fromISO('2020-07-27T13:46:39.348Z', {
        zone: timezoneBudapest,
      }).offset,
    );
  });

  it('toMillis return the UTC millis, so it is zone independent', () => {
    // console.log(
    //     DateTime.local().toMillis(),
    //     DateTime.utc().toMillis(),
    //     DateTime.local().setZone(timezoneNewYork).toMillis()
    // );
    expect(
      DateTime.local().toMillis() - DateTime.utc().toMillis(),
    ).toBeLessThan(10);
    expect(
      DateTime.local().toMillis() -
        DateTime.local().setZone(timezoneNewYork).toMillis(),
    ).toBeLessThan(10);
  });

  it('weekday is in the defined timezone', () => {
    // console.log(DateTime.fromISO("2020-08-01T01:30").setZone(timezoneNewYork).toISO());
    expect(
      DateTime.fromISO('2020-08-01T01:30').setZone(timezoneNewYork).weekdayLong,
    ).toEqual('Friday');
    expect(
      DateTime.fromISO('2020-08-01T01:30').setZone(timezoneLondon).weekdayLong,
    ).toEqual('Saturday');
  });

  it('hour is in the defined timezone', () => {
    expect(
      DateTime.fromISO('2020-08-01T01:30').setZone(timezoneNewYork).hour,
    ).toEqual(19);
    expect(
      DateTime.fromISO('2020-08-01T01:30').setZone(timezoneLondon).hour,
    ).toEqual(0);
  });
});
