import { dateStringSchema, timeStringSchema } from './date-time';

describe('DateTime -', () => {
  describe('dateStringSchema validaton test', () => {
    it('should be INVALID', () => {
      expect(dateStringSchema.validate(12)).toMatchSnapshot();
      expect(dateStringSchema.validate('STRING')).toMatchSnapshot();
      expect(dateStringSchema.validate('0000-00-00')).toMatchSnapshot();
      expect(dateStringSchema.validate('1234-13-01')).toMatchSnapshot();
      expect(dateStringSchema.validate('1234-12-32')).toMatchSnapshot();
    });

    it('should be VALID', () => {
      expect(dateStringSchema.validate('2010-12-01')).toMatchSnapshot();
    });
  });

  describe('timeStringSchema validaton test', () => {
    it('should be INVALID', () => {
      expect(timeStringSchema.validate(12)).toMatchSnapshot();
      expect(timeStringSchema.validate('STRING')).toMatchSnapshot();
      expect(timeStringSchema.validate('24:01')).toMatchSnapshot();
      expect(timeStringSchema.validate('23:61')).toMatchSnapshot();
    });

    it('should be VALID', () => {
      expect(timeStringSchema.validate('00:00')).toMatchSnapshot();
      expect(timeStringSchema.validate('01:01')).toMatchSnapshot();
      expect(timeStringSchema.validate('23:59')).toMatchSnapshot();
    });
  });
});
