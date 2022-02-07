import { DateTime } from 'luxon';

import { timezoneBudapest } from '@bgap/shared/utils';

const dateAgo = (days: number) =>
  DateTime.fromISO(new Date().toISOString(), {
    zone: timezoneBudapest,
  })
    .minus({ days })
    .toJSDate()
    .toString();

export const reportUsersFixture = [
  {
    id: 'anonym_1',
    email: 'testuser+anonymuser1@anyupp.com',
    ucd: new Date().getTime(),
  },
  {
    id: 'anonym_2',
    email: 'testuser+anonymuser2@anyupp.com',
    ucd: new Date().getTime(),
  },
  {
    id: 'anonym_3',
    email: 'testuser+anonymuser3@anyupp.com',
    ucd: new Date().getTime(),
  },
  {
    id: 'email_1',
    email: 'testuser+a1@anyupp.com',
    ucd: new Date().getTime(),
  },
  {
    id: 'email_2',
    email: 'testuser+a2@anyupp.com',
    ucd: new Date().getTime(),
  },
  {
    id: 'email_3',
    email: 'testuser+a3@anyupp.com',
    ucd: new Date().getTime(),
  },
  {
    id: 'facebook_1',
    email: 'testuser+fb1@anyupp.com',
    ucd: new Date().getTime(),
  },
  {
    id: 'facebook_2',
    email: 'testuser+fb2@anyupp.com',
    ucd: new Date().getTime(),
  },
  {
    id: 'google_1',
    email: 'testuser+g1@anyupp.com',
    ucd: new Date().getTime(),
  },
  {
    id: 'google_2',
    email: 'testuser+g2@anyupp.com',
    ucd: new Date().getTime(),
  },
  {
    id: 'signinwithapple_1',
    email: 'testuser+apple1@anyupp.com',
    ucd: new Date().getTime(),
  },
  {
    id: 'signinwithapple_2',
    email: 'testuser+apple2@anyupp.com',
    ucd: new Date().getTime(),
  },
];

export const fourWeeksOrdersFixture = [
  {
    createdAt: dateAgo(1),
    userId: 'anonym_1',
    sumPriceShown: { currency: 'HUF', priceSum: 1000 },
  },
  {
    createdAt: dateAgo(2),
    userId: 'anonym_1',
    sumPriceShown: { currency: 'HUF', priceSum: 1000 },
  },
  {
    createdAt: dateAgo(3),
    userId: 'anonym_2',
    sumPriceShown: { currency: 'HUF', priceSum: 1000 },
  },
  {
    createdAt: dateAgo(4),
    userId: 'anonym_3',
    sumPriceShown: { currency: 'HUF', priceSum: 1000 },
  },
  {
    createdAt: dateAgo(5),
    userId: 'email_1',
    sumPriceShown: { currency: 'HUF', priceSum: 1000 },
  },
  {
    createdAt: dateAgo(6),
    userId: 'email_2',
    sumPriceShown: { currency: 'HUF', priceSum: 1000 },
  },
  {
    createdAt: dateAgo(7),
    userId: 'email_3',
    sumPriceShown: { currency: 'HUF', priceSum: 1000 },
  },
  {
    createdAt: dateAgo(8),
    userId: 'email_3',
    sumPriceShown: { currency: 'HUF', priceSum: 1000 },
  },
  {
    createdAt: dateAgo(9),
    userId: 'facebook_1',
    sumPriceShown: { currency: 'HUF', priceSum: 1000 },
  },
  {
    createdAt: dateAgo(10),
    userId: 'facebook_2',
    sumPriceShown: { currency: 'HUF', priceSum: 1000 },
  },
];

export const thisYearOrdersFixture = [
  ...fourWeeksOrdersFixture,
  {
    createdAt: dateAgo(11),
    userId: 'facebook_2',
    sumPriceShown: { currency: 'HUF', priceSum: 1000 },
  },
  {
    createdAt: dateAgo(42),
    userId: 'google_1',
    sumPriceShown: { currency: 'HUF', priceSum: 1000 },
  },
  {
    createdAt: dateAgo(43),
    userId: 'google_2',
    sumPriceShown: { currency: 'HUF', priceSum: 1000 },
  },
  {
    createdAt: dateAgo(44),
    userId: 'signinwithapple_1',
    sumPriceShown: { currency: 'HUF', priceSum: 1000 },
  },
  {
    createdAt: dateAgo(45),
    userId: 'signinwithapple_2',
    sumPriceShown: { currency: 'HUF', priceSum: 1000 },
  },
];
