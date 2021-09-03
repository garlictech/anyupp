import { timezoneBudapest, timezoneLondon, timezoneUSCentral } from '../const';
import { getDayIntervals, makeId } from './forms';

describe('Forms pure function tests', () => {
  describe('getDayIntervals', () => {
    it('should calculate intervals from date', () => {
      expect(getDayIntervals('2021-01-31', timezoneBudapest))
        .toMatchInlineSnapshot(`
        Object {
          "from": 1612047600000,
          "to": 1612133999999,
        }
      `);
      expect(getDayIntervals('2021-09-01', timezoneBudapest))
        .toMatchInlineSnapshot(`
        Object {
          "from": 1630447200000,
          "to": 1630533599999,
        }
      `);

      expect(getDayIntervals('2021-01-31', timezoneLondon))
        .toMatchInlineSnapshot(`
        Object {
          "from": 1612051200000,
          "to": 1612137599999,
        }
      `);
      expect(getDayIntervals('2021-09-01', timezoneLondon))
        .toMatchInlineSnapshot(`
        Object {
          "from": 1630450800000,
          "to": 1630537199999,
        }
      `);

      expect(getDayIntervals('2021-01-31', timezoneUSCentral))
        .toMatchInlineSnapshot(`
        Object {
          "from": 1611986400000,
          "to": 1612072799999,
        }
      `);
      expect(getDayIntervals('2021-09-01', timezoneUSCentral))
        .toMatchInlineSnapshot(`
        Object {
          "from": 1630386000000,
          "to": 1630472399999,
        }
      `);
    });
  });

  describe('makeId', () => {
    const regex = /^[a-zA-Z0-9]+$/gi;

    test.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])(
      'should calculate %i length random id',
      i => {
        const result = makeId(i);
        expect(result).toMatch(regex);
        expect(result).toHaveLength(i);
      },
    );
  });
});
