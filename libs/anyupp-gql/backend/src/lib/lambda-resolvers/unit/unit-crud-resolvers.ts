import bcrypt from 'bcryptjs';
import { v1 as uuidV1 } from 'uuid';
import { tableConfig } from '@bgap/crud-gql/backend';
import * as CrudApi from '@bgap/crud-gql/api';
import { createUpdateParams } from '@bgap/shared/utils';
import { pipe } from 'fp-ts/lib/function';
import { from, Observable } from 'rxjs';
import { map, mapTo, tap } from 'rxjs/operators';
import * as R from 'ramda';
import { UnitsResolverDeps } from './utils';
import { DynamoDB } from 'aws-sdk';

const hashPasswords =
  (deps: UnitsResolverDeps) => (input: { pos?: CrudApi.Maybe<CrudApi.Pos> }) =>
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
  (deps: UnitsResolverDeps) => (args: CrudApi.MutationCreateUnitArgs) =>
    pipe(
      args.input,
      item => ({
        ...item,
        id: item.id || deps.uuidGenerator(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
      item => (item.pos?.rkeeper ? hashPasswords(deps)(item) : item),
      Item => ({
        TableName: deps.tableName,
        Item,
      }),
      params => from(deps.docClient.put(params).promise()),
      map(res => res?.Attributes as CrudApi.Unit),
    );

export const updateUnitResolver =
  (deps: UnitsResolverDeps) => (args: CrudApi.MutationUpdateUnitArgs) =>
    pipe(
      args.input,
      input => (input.pos?.rkeeper ? hashPasswords(deps)(input) : input),
      item => createUpdateParams(deps.tableName, args.input.id, item),
      item => ({
        ...item,
        updatedAt: new Date().toISOString(),
      }),
      item => from(deps.docClient.update(item).promise()),
      map(res => res?.Attributes as CrudApi.Unit),
    );

export const createUnitsDeps = (): UnitsResolverDeps => ({
  docClient: new DynamoDB.DocumentClient(),
  hashGenerator: (password: string) =>
    bcrypt.hashSync(password, process.env.SALT || ''),
  uuidGenerator: uuidV1,
  tableName: tableConfig.Unit.TableName,
  crudSdk: CrudApi.getCrudSdkForIAM(
    process.env.API_ACCESS_KEY_ID || '',
    process.env.API_SECRET_ACCESS_KEY || '',
  ),
});
