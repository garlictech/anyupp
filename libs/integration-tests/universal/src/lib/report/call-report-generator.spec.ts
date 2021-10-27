import { calculateReport, createReport } from '@bgap/anyupp-backend-lib';
import { getCrudSdkForIAM } from '@bgap/crud-gql/api';

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

  xit('call the generator', done => {
    const deps = {
      region: 'eu-west-1',
      userPoolId: 'copy from prod-anyupp-backend-consumer-user-pool',
      crudSdk: getCrudSdkForIAM(
        'your_prod_awsAccesskeyId',
        'your_prod_awsSecretAccessKey',
      ),
      reportFile: `./weeklyReport-${reportDate}.xlsx`,
      reportDate,
      slackBotToken: 'slack_bot_token',
    };

    createReport(deps)(done);
  }, 125000);
});
