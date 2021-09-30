import { calculateReport, createReport } from '@bgap/anyupp-backend-lib';
import { getCrudSdkForIAM } from '@bgap/crud-gql/api';

import {
  fourWeeksOrdersFixture,
  reportUsersFixture,
  thisYearOrdersFixture,
} from './fixtures';

const reportDate = new Date().toLocaleDateString('hu');

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

  xit('call the generator', done => {
    const deps = {
      region: 'eu-west-1',
      userPoolId: 'copy from prod-anyupp-backend-consumer-user-pool',
      crudSdk: getCrudSdkForIAM(
        'your_prod_awsAccesskeyId',
        'your_prod_awsSecretAccessKey',
      ),
      xlsPath: './weeklyReport.xlsx',
      reportDate,
    };

    createReport(deps)(done);
  }, 125000);
});
