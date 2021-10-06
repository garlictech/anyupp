import { combineLatest } from 'rxjs';

import { Maybe } from '@bgap/crud-gql/api';

import { cognitoUsersStream$ } from './cognito-utils';
import { ReportDeps, ReportOrderData, ReportUserData } from './interfaces';
import {
  calculateReport,
  endOfDay,
  fourWeeksAgo,
  getOrdersFromDateInterval,
  saveExcelReport,
  startOfThisYear,
} from './report-utils';
import { uploadReport } from './slack-utils';

export const createReport = (deps: ReportDeps) => (testDone: () => void) => {
  const thisYearOrderList$ = getOrdersFromDateInterval(
    deps,
    startOfThisYear(deps.reportDate),
    endOfDay(deps.reportDate),
  );
  const fourWeeksOrderList$ = getOrdersFromDateInterval(
    deps,
    fourWeeksAgo(deps.reportDate),
    endOfDay(deps.reportDate),
  );

  // Execute the calculations
  combineLatest([
    cognitoUsersStream$(deps),
    thisYearOrderList$,
    fourWeeksOrderList$,
  ]).subscribe(
    async ([users, thisYearOrderList, fourWeeksOrderList]: [
      ReportUserData[],
      Maybe<ReportOrderData>[],
      Maybe<ReportOrderData>[],
    ]) => {
      const report = calculateReport(
        deps.reportDate,
        thisYearOrderList,
        fourWeeksOrderList,
        users,
      );

      saveExcelReport(report, deps.reportFile);

      try {
        const slackResponse = await uploadReport(deps)();
        console.log('slackResponse data: ', slackResponse?.data);
      } catch (err) {
        console.error('Slack API error: ', err);
      }

      testDone();
    },
  );
};
