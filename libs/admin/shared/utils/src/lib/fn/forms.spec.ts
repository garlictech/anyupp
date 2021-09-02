import { makeId, getDayIntervals } from './forms';

describe('Forms pure function tests', () => {
  describe.skip('getDayIntervals', () => {
    it('should calculate intervals from date', () => {
      expect(getDayIntervals('2021-01-31')).toMatchSnapshot();
      expect(getDayIntervals('2021-09-01')).toMatchSnapshot();
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
