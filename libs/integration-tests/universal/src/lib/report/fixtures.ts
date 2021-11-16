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
    email: 'anonymuser+1@anyupp.com',
    ucd: new Date().getTime(),
  },
  {
    id: 'anonym_2',
    email: 'anonymuser+2@anyupp.com',
    ucd: new Date().getTime(),
  },
  {
    id: 'anonym_3',
    email: 'anonymuser+3@anyupp.com',
    ucd: new Date().getTime(),
  },
  {
    id: 'email_1',
    email: 'a@a.hu',
    ucd: new Date().getTime(),
  },
  {
    id: 'email_2',
    email: 'b@b.hu',
    ucd: new Date().getTime(),
  },
  {
    id: 'email_3',
    email: 'c@c.hu',
    ucd: new Date().getTime(),
  },
  {
    id: 'facebook_1',
    email: 'fb1@gmail.com',
    ucd: new Date().getTime(),
  },
  {
    id: 'facebook_2',
    email: 'fb2@gmail.com',
    ucd: new Date().getTime(),
  },
  {
    id: 'google_1',
    email: 'g1@gmail.com',
    ucd: new Date().getTime(),
  },
  {
    id: 'google_2',
    email: 'g2@gmail.com',
    ucd: new Date().getTime(),
  },
  {
    id: 'signinwithapple_1',
    email: 'apple1@gmail.com',
    ucd: new Date().getTime(),
  },
  {
    id: 'signinwithapple_2',
    email: 'apple2@gmail.com',
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
