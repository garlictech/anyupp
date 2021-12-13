import * as R from 'ramda';
import { pipe } from 'fp-ts/lib/function';
import { expect } from '@jest/globals';

export const ES_DELAY = 3000; //ms
export const DYNAMO_DELAY = 1000; //ms

// Replace UUID-s with a static string for jest matchers
export const maskV4UuidIds = <T>(data: T) =>
  pipe(
    data,
    JSON.stringify,
    R.replace(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g,
      'MASKED ID',
    ),
    (d: string) => JSON.parse(d) as T,
  );

export const dateMatcher = {
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
};
