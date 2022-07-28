import * as R from 'ramda';
import { pipe, flow } from 'fp-ts/lib/function';

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

export const maskTimestamp = <T>(data: T) =>
  pipe(
    data,
    JSON.stringify,
    R.replace(/"ts":[ ]*[0-9]{13}/g, '"ts": "MASKED TIMESTAMP"'),
    (d: string) => JSON.parse(d) as T,
  );

export const maskDate = <T>(data: T) =>
  pipe(
    data,
    JSON.stringify,
    R.replace(
      /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/g,
      'MASKED DATE',
    ),
    (d: string) => JSON.parse(d) as T,
  );

export const maskPasswords = <T>(data: T) =>
  pipe(
    data,
    JSON.stringify,
    R.replace(
      /"anyuppPassword":[ ]*"[^"]*"/g,
      '"anyuppPassword": "MASKED ANYUPP PASSWORD"',
    ),
    (d: string) => JSON.parse(d) as T,
  );

export const maskAll = flow(
  maskV4UuidIds,
  maskTimestamp,
  maskDate,
  maskPasswords,
);

export const sanitizeField =
  <T>(fieldPath: (number | string)[]) =>
  (data: T) =>
    pipe(
      R.clone(data),
      R.assocPath(fieldPath, maskAll(R.path(fieldPath)(data))),
    );
