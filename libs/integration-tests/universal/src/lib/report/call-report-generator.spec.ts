import { calculateReport } from '@bgap/backend/reports';

import {
  fourWeeksOrdersFixture,
  reportUsersFixture,
  thisYearOrdersFixture,
} from './fixtures';

// Must have 'YYYY-MM-DD' format!
const reportDate = new Date().toISOString().substr(0, 10); // '2021-09-26'

describe('Report', () => {
  describe('Calculation logic', () => {
    it('should calculate from empty arrays', done => {
      expect(calculateReport(reportDate, [], [], [])).toMatchSnapshot();

      done();
    });

    it('should calculate from fixtures', done => {
      expect(
        calculateReport(
          reportDate,
          thisYearOrdersFixture,
          fourWeeksOrdersFixture,
          reportUsersFixture,
        ),
      ).toMatchSnapshot();

      done();
    });
  });
});
