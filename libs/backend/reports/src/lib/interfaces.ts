import { CrudSdk } from '@bgap/crud-gql/api';

export interface ReportDeps {
  region: string;
  userPoolId: string;
  crudSdk: CrudSdk;
  reportFile: string;
  reportDate: string;
  slackBotToken: string;
  slackChannel: string;
  environment: string;
}

export interface ReportUserData {
  id: string;
  ucd?: number;
  email: string;
}

export interface ReportOrderData {
  createdAt: string;
  userId: string;
  sumPriceShown: {
    currency: string;
    priceSum: number;
  };
}

export interface ReportIntervalData {
  userCounts: {
    total: number;
    apple: number;
    facebook: number;
    google: number;
    anonym: number;
    email: number;
  };
  totalOrdersCount: number;
  uniqueOrderUsers: number;
  totalRevenue: number;
  avgOrderRevenue: number;
  avgOrderCountPerUser: number;
  avgUserActiveDaysCount: number;
  avgOrderRevenuePerUser: number;
  avgDailyOrdersCount: number;
}

export interface ReportData {
  thisYear: ReportIntervalData;
  lastFourWeeks: ReportIntervalData;
}
