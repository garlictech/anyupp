import { Maybe } from '@bgap/crud-gql/api';
import { combineLatest } from 'rxjs';

import { getCognitoUsersStream } from './cognito-utils';
import { ReportDeps, ReportOrderData, ReportUserData } from './interfaces';
import {
  calculateReport,
  endOfToday,
  fourWeeksAgo,
  getOrdersFromDateInterval,
  saveExcelReport,
  startOfThisYear,
} from './report-utils';

export const createReport = (deps: ReportDeps) => (testDone: () => void) => {
  const cognitoUsers$ = getCognitoUsersStream(deps);
  const thisYearOrderList$ = getOrdersFromDateInterval(
    deps,
    startOfThisYear(deps.reportDate),
    endOfToday(deps.reportDate),
  );
  const fourWeeksOrderList$ = getOrdersFromDateInterval(
    deps,
    fourWeeksAgo(deps.reportDate),
    endOfToday(deps.reportDate),
  );

  // Execute the calculations
  combineLatest([
    cognitoUsers$,
    thisYearOrderList$,
    fourWeeksOrderList$,
  ]).subscribe(
    ([users, thisYearOrderList, fourWeeksOrderList]: [
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

      saveExcelReport(report, deps.xlsPath);
      testDone();
    },
  );
};
