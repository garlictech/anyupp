import { DateTime } from 'luxon';
import { map, shareReplay } from 'rxjs/operators';
import * as XLSX from 'xlsx';

import { Maybe } from '@bgap/crud-gql/api';
import { getAllPaginatedData } from '@bgap/gql-sdk';
import { timezoneBudapest } from '@bgap/shared/utils';

import {
  ReportData,
  ReportDeps,
  ReportOrderData,
  ReportUserData,
} from './interfaces';

export const getOrdersFromDateInterval = (
  deps: ReportDeps,
  from: number,
  to: number,
) =>
  getAllPaginatedData(deps.crudSdk.SearchReportOrders, {
    query: {
      filter: {
        createdAt: {
          gte: new Date(from).toISOString(),
          lte: new Date(to).toISOString(),
        },
      },
    },
    options: { fetchPolicy: 'no-cache' },
  }).pipe(
    // filterNullish(),
    map(list => list.items),
    shareReplay(1),
  );

export const startOfThisYear = (today: string): number =>
  DateTime.fromISO(new Date(today).toISOString(), {
    zone: timezoneBudapest,
  })
    .startOf('year')
    .valueOf();

export const fourWeeksAgo = (today: string): number =>
  DateTime.fromISO(new Date(today).toISOString(), {
    zone: timezoneBudapest,
  })
    .minus({ weeks: 4 })
    .startOf('day')
    .valueOf();

export const endOfDay = (day: string): number =>
  DateTime.fromISO(new Date(day).toISOString(), {
    zone: timezoneBudapest,
  })
    .endOf('day')
    .valueOf();

const isAnonymUser = (email: string) =>
  email.indexOf('anonymuser') >= 0 && email.indexOf('@anyupp.com') >= 0;

export const getUserCounts = (users: ReportUserData[]) => ({
  total: users.length,
  apple: users.filter(u => u.id.indexOf('signinwithapple_') >= 0).length,
  facebook: users.filter(u => u.id.indexOf('facebook_') >= 0).length,
  google: users.filter(u => u.id.indexOf('google_') >= 0).length,
  anonym: users.filter(u => isAnonymUser(u.email)).length,
  email: users.filter(
    u =>
      !(
        u.id.indexOf('signinwithapple_') >= 0 ||
        u.id.indexOf('facebook_') >= 0 ||
        u.id.indexOf('google_') >= 0 ||
        isAnonymUser(u.email)
      ),
  ).length,
});

export const calculateReport = (
  reportDate: string,
  thisYearOrderList: Maybe<ReportOrderData>[],
  fourWeeksOrderList: Maybe<ReportOrderData>[],
  userList: ReportUserData[],
) => {
  // Unique user ids
  const thisYearOrderUniqueUserIds = [
    ...new Set(thisYearOrderList.map(o => o?.userId)),
  ];
  const fourWeeksOrderUniqueUserIds = [
    ...new Set(fourWeeksOrderList.map(o => o?.userId)),
  ];

  // Total revenue
  const totalYearlyRevenue = thisYearOrderList.reduce(
    (acc, val) => acc + (val?.sumPriceShown.priceSum || 0),
    0,
  );
  const totalFourWeeksRevenue = fourWeeksOrderList.reduce(
    (acc, val) => acc + (val?.sumPriceShown.priceSum || 0),
    0,
  );

  // Order days
  const thisYearOrderDaysCount = [
    ...new Set(thisYearOrderList.map(o => o?.createdAt.substr(0, 10))),
  ].length;
  const fourWeeksOrderDaysCount = [
    ...new Set(fourWeeksOrderList.map(o => o?.createdAt.substr(0, 10))),
  ].length;

  // Order days by user
  const thisYearUserActiveDaysMap: Record<string, number> = {};
  thisYearOrderUniqueUserIds.forEach(userId => {
    if (userId) {
      thisYearUserActiveDaysMap[userId] = [
        ...new Set(
          thisYearOrderList
            .filter(o => o?.userId === userId)
            .map(o => o?.createdAt.substr(0, 10)),
        ),
      ].length;
    }
  });

  const fourWeeksUserActiveDaysMap: Record<string, number> = {};
  fourWeeksOrderUniqueUserIds.forEach(userId => {
    if (userId) {
      fourWeeksUserActiveDaysMap[userId] = [
        ...new Set(
          fourWeeksOrderList
            .filter(o => o?.userId === userId)
            .map(o => o?.createdAt.substr(0, 10)),
        ),
      ].length;
    }
  });

  return {
    thisYear: {
      userCounts: getUserCounts(
        userList.filter(u => (u.ucd || 0) >= startOfThisYear(reportDate)),
      ),
      totalOrdersCount: thisYearOrderList.length,
      uniqueOrderUsers: thisYearOrderUniqueUserIds.length,
      totalRevenue: totalYearlyRevenue,
      avgOrderRevenue:
        thisYearOrderList.length > 0
          ? totalYearlyRevenue / thisYearOrderList.length
          : 0,
      avgOrderCountPerUser:
        thisYearOrderUniqueUserIds.length > 0
          ? thisYearOrderList.length / thisYearOrderUniqueUserIds.length
          : 0,
      avgOrderRevenuePerUser:
        thisYearOrderUniqueUserIds.length > 0
          ? totalYearlyRevenue / thisYearOrderUniqueUserIds.length
          : 0,
      avgDailyOrdersCount:
        thisYearOrderDaysCount > 0
          ? thisYearOrderList.length / thisYearOrderDaysCount
          : 0,
      avgUserActiveDaysCount: Object.values(thisYearUserActiveDaysMap).reduce(
        (avg, value, _, { length }) => avg + value / length,
        0,
      ),
    },
    lastFourWeeks: {
      userCounts: getUserCounts(
        userList.filter(u => (u.ucd || 0) >= fourWeeksAgo(reportDate)),
      ),
      totalOrdersCount: fourWeeksOrderList.length,
      uniqueOrderUsers: fourWeeksOrderUniqueUserIds.length,
      totalRevenue: totalFourWeeksRevenue,
      avgOrderRevenue:
        fourWeeksOrderList.length > 0
          ? totalFourWeeksRevenue / fourWeeksOrderList.length
          : 0,
      avgOrderCountPerUser:
        fourWeeksOrderUniqueUserIds.length > 0
          ? fourWeeksOrderList.length / fourWeeksOrderUniqueUserIds.length
          : 0,
      avgOrderRevenuePerUser:
        fourWeeksOrderUniqueUserIds.length > 0
          ? totalFourWeeksRevenue / fourWeeksOrderUniqueUserIds.length
          : 0,
      avgDailyOrdersCount:
        fourWeeksOrderDaysCount > 0
          ? fourWeeksOrderList.length / fourWeeksOrderDaysCount
          : 0,
      avgUserActiveDaysCount: Object.values(fourWeeksUserActiveDaysMap).reduce(
        (avg, value, _, { length }) => avg + value / length,
        0,
      ),
    },
  };
};

export const saveExcelReport = (report: ReportData, xlsPath: string) => {
  const arr: (string | number)[][] = [
    ['', 'This year', 'Last 4 weeks'],
    [
      'Nr of total users (anonym incl): ',
      report.thisYear.userCounts.total,
      report.lastFourWeeks.userCounts.total,
    ],
    [
      'login apple: ',
      report.thisYear.userCounts.apple,
      report.lastFourWeeks.userCounts.apple,
    ],
    [
      'login google: ',
      report.thisYear.userCounts.google,
      report.lastFourWeeks.userCounts.google,
    ],
    [
      'login facebook: ',
      report.thisYear.userCounts.facebook,
      report.lastFourWeeks.userCounts.facebook,
    ],
    [
      'login email: ',
      report.thisYear.userCounts.email,
      report.lastFourWeeks.userCounts.email,
    ],
    [
      'login anonymus: ',
      report.thisYear.userCounts.anonym,
      report.lastFourWeeks.userCounts.anonym,
    ],
    [
      'Total orders count: ',
      report.thisYear.totalOrdersCount,
      report.lastFourWeeks.totalOrdersCount,
    ],
    [
      'Unique ordering users: ',
      report.thisYear.uniqueOrderUsers,
      report.lastFourWeeks.uniqueOrderUsers,
    ],
    [
      'Avg. order count / unique user: ',
      report.thisYear.avgOrderCountPerUser.toFixed(2),
      report.lastFourWeeks.avgOrderCountPerUser.toFixed(2),
    ],
    [
      'Avg. order / day: ',
      report.thisYear.avgDailyOrdersCount.toFixed(2),
      report.lastFourWeeks.avgDailyOrdersCount.toFixed(2),
    ],
    [
      'Avg. User active days: ',
      report.thisYear.avgUserActiveDaysCount.toFixed(2),
      report.lastFourWeeks.avgUserActiveDaysCount.toFixed(2),
    ],
    [
      'Total revenue (HUF): ',
      report.thisYear.totalRevenue.toFixed(2),
      report.lastFourWeeks.totalRevenue.toFixed(2),
    ],
    [
      'Avg. order revenue (HUF): ',
      report.thisYear.avgOrderRevenue.toFixed(2),
      report.lastFourWeeks.avgOrderRevenue.toFixed(2),
    ],
    [
      'Avg. user order revenue (HUF): ',
      report.thisYear.avgOrderRevenuePerUser.toFixed(2),
      report.lastFourWeeks.avgOrderRevenuePerUser.toFixed(2),
    ],
  ];

  const myworkbook: XLSX.WorkBook = {
    Sheets: { data: XLSX.utils.aoa_to_sheet(arr) },
    SheetNames: ['data'],
  };

  XLSX.writeFile(myworkbook, xlsPath);
};
