import * as CrudApi from '@bgap/crud-gql/api';
import { createUpdateParams } from '@bgap/shared/utils';
import { flow, pipe } from 'fp-ts/lib/function';
import { from } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import AWS from 'aws-sdk';
import { tableConfig } from '@bgap/crud-gql/backend';
import * as R from 'ramda';

const docClient = new AWS.DynamoDB.DocumentClient();

interface UnitResolverDeps {
  hashGenerator: (arg: string) => string;
  tableName: string;
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
                password ? deps.hashGenerator(password) : undefined,
              item,
            ),
          input,
          lenses,
        ),
    );

export const createUnitResolver = (deps: UnitResolverDeps) =>
  flow(
    hashPasswords(deps),
    Item => ({
      TableName: tableConfig.Unit.TableName,
      Item,
    }),
    params => from(docClient.put(params).promise()),
    mapTo(true),
  );

export const UpdateUnitResolver =
  (deps: UnitResolverDeps) => (input: CrudApi.UpdateUnitInput) =>
    pipe(
      hashPasswords(deps)(input),
      R.curry(createUpdateParams)(deps.tableName)(input.id),
      item => from(docClient.update(item).promise()),
      mapTo(true),
    );
