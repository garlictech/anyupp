import * as CrudApi from '@bgap/crud-gql/api';
import { createUpdateParams } from '@bgap/shared/utils';
import { pipe } from 'fp-ts/lib/function';
import { from, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { DynamoDB } from 'aws-sdk';
import * as R from 'ramda';

export interface UnitResolverDeps {
  hashGenerator: (arg: string) => string;
  uuidGenerator: () => string;
  tableName: string;
  docClient: DynamoDB.DocumentClient;
}

const hashPasswords =
  (deps: UnitResolverDeps) => (input: { pos?: CrudApi.Maybe<CrudApi.Pos> }) =>
    pipe(
      ['rkeeperPassword', 'anyuppPassword'],
      R.map((prop: string) => R.lensPath(['pos', 'rkeeper', prop])),
      lenses =>
        R.reduce(
          (item, lens) =>
            R.over(
              lens,
              (password?) =>
                R.isNil(password) ? password : deps.hashGenerator(password),
              item,
            ),
          input,
          lenses,
        ),
    );

export const createUnitResolver =
  (deps: UnitResolverDeps) =>
  (item: CrudApi.CreateUnitInput): Observable<boolean> =>
    pipe(
      {
        ...item,
        id: item.id || deps.uuidGenerator(),
      },
      item => (item.pos?.rkeeper ? hashPasswords(deps)(item) : item),
      Item => ({
        TableName: deps.tableName,
        Item,
      }),
      params => from(deps.docClient.put(params).promise()),
      mapTo(true),
    );

export const updateUnitResolver =
  (deps: UnitResolverDeps) => (input: CrudApi.UpdateUnitInput) =>
    pipe(
      input.pos?.rkeeper ? hashPasswords(deps)(input) : input,
      item => createUpdateParams(deps.tableName, input.id, item),
      item => from(deps.docClient.update(item).promise()),
      mapTo(true),
    );
