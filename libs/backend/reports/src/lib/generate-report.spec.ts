import { of } from 'rxjs';
import { take } from 'rxjs/operators';

import { getCrudSdkForIAM } from '@bgap/crud-gql/api';

import * as reportGenerator from './generate-report';

describe('ReportGenerator', () => {
  const reportDate = new Date().toISOString().substr(0, 10);
  const environment = process.env.ENVIRONMENT || 'unknown_environment';

  const deps = {
    region: 'eu-west-1',
    userPoolId: 'eu-west-1_UG2rqhBeW',
    crudSdk: getCrudSdkForIAM(
      'AKIAYIT7GMY5RXSLLQN3',
      'aYxNIqJ7O56ltpHb1Aq534bpv2r+Atpr1TUxiahx',
    ),
    reportFile: `./weeklyReport-${reportDate}.xlsx`,
    reportDate,
    slackBotToken: 'xoxb-84478593255-2547683587239-syWqK9Yy5d0DBfUs1V6zrUxw',
    slackChannel: 'anyupp-reports',
    environment,
  };

  it('run createReport', () => {
    const reportSpy = jest
      .spyOn(reportGenerator, 'createReport')
      .mockImplementation(jest.fn().mockReturnValue(of(true)));

    reportGenerator
      .createReport(deps)
      .pipe(take(1))
      .subscribe(() => {
        expect(reportSpy).toBeCalledWith(deps);
      });
  });
});
