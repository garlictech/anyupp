import * as CrudApi from '@bgap/crud-gql/api';
import { createUpdateParams } from '@bgap/shared/utils';
import { flow, pipe } from 'fp-ts/lib/function';
import { from, Observable } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';
import { DynamoDB } from 'aws-sdk';
import { tableConfig } from '@bgap/crud-gql/backend';
import * as R from 'ramda';

export interface UnitResolverDeps {
  hashGenerator: (arg: string) => Promise<string>;
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
        TableName: tableConfig.Unit.TableName,
        Item,
      }),
      params => from(deps.docClient.put(params).promise()),
      mapTo(true),
    );

export const updateUnitResolver =
  (deps: UnitResolverDeps) => (input: CrudApi.UpdateUnitInput) =>
    pipe(
      hashPasswords(deps)(input),
      item => createUpdateParams(deps.tableName, input.id, item),
      item => from(deps.docClient.update(item).promise()),
      mapTo(true),
    );
