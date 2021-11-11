import { getTimezoneFromLocation } from '.';

describe('Date utils', () => {
  describe('getTimezoneFromLocation function', () => {
    it('should return default timezone from empty location', () => {
      expect(getTimezoneFromLocation(null)).toMatchInlineSnapshot(
        `"Europe/Budapest"`,
      );
    });

    it('should return timezone from Budapest', () => {
      expect(
        getTimezoneFromLocation({
          lat: 47.497913,
          lng: 19.040236,
        }),
      ).toMatchInlineSnapshot(`"Europe/Budapest"`);
    });

    it('should return timezone from Szeged', () => {
      expect(
        getTimezoneFromLocation({
          lat: 46.253,
          lng: 20.14824,
        }),
      ).toMatchInlineSnapshot(`"Europe/Budapest"`);
    });
    it('should return timezone from Salzburg', () => {
      expect(
        getTimezoneFromLocation({
          lat: 47.8240825,
          lng: 13.0288551,
        }),
      ).toMatchInlineSnapshot(`"Europe/Vienna"`);
    });
    it('should return timezone from Paris', () => {
      expect(
        getTimezoneFromLocation({
          lat: 48.864716,
          lng: 2.349014,
        }),
      ).toMatchInlineSnapshot(`"Europe/Paris"`);
    });
    it('should return timezone from New York', () => {
      expect(
        getTimezoneFromLocation({
          lat: 40.73061,
          lng: -73.935242,
        }),
      ).toMatchInlineSnapshot(`"America/New_York"`);
    });
  });
});
