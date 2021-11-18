import bcrypt from 'bcryptjs';
import { v1 as uuidV1 } from 'uuid';
import { tableConfig } from '@bgap/crud-gql/backend';
import * as CrudApi from '@bgap/crud-gql/api';
import { createUpdateParams } from '@bgap/shared/utils';
import { pipe } from 'fp-ts/lib/function';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import * as R from 'ramda';
import { UnitsResolverDeps } from './utils';
import { DynamoDB } from 'aws-sdk';

export const hashPasswords =
  (hashGenerator: UnitsResolverDeps['hashGenerator']) =>
  <T extends { pos?: CrudApi.Maybe<CrudApi.Pos> }>(input: T): T =>
    pipe(
      ['anyuppPassword'],
      R.map((prop: string) => R.lensPath(['pos', 'rkeeper', prop])),
      lenses =>
        R.reduce(
          (item, lens) =>
            R.over(
              lens,
              (password?) =>
                R.isNil(password) ? password : hashGenerator(password),
              item,
            ),
          input,
          lenses,
        ),
    );

export const createUnitResolver =
  (deps: UnitsResolverDeps) =>
  (
    args: CrudApi.MutationCreateUnitArgs,
  ): ReturnType<CrudApi.CrudSdk['CreateUnit']> =>
    pipe(
      args.input,
      item => ({
        ...item,
        id: item.id || deps.uuidGenerator(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
      (item: CrudApi.CreateUnitInput) =>
        item.pos?.rkeeper ? hashPasswords(deps.hashGenerator)(item) : item,
      (Item: CrudApi.CreateUnitInput) => ({
        TableName: deps.tableName,
        Item,
      }),
      params =>
        from(deps.docClient.put(params).promise()).pipe(
          map(() => params.Item as CrudApi.Unit),
        ),
    );

export const updateUnitResolver =
  (deps: UnitsResolverDeps) =>
  (
    args: CrudApi.MutationUpdateUnitArgs,
  ): ReturnType<CrudApi.CrudSdk['UpdateUnit']> =>
    pipe(
      args.input,
      input =>
        input.pos?.rkeeper ? hashPasswords(deps.hashGenerator)(input) : input,
      item => createUpdateParams(deps.tableName, args.input.id, item),
      item => ({
        ...item,
        updatedAt: new Date().toISOString(),
      }),
      item => from(deps.docClient.update(item).promise()),
      map(res => res?.Attributes as CrudApi.Unit),
    );

export const createUnitsDeps = (
  crudSdk?: CrudApi.CrudSdk,
): UnitsResolverDeps => ({
  docClient: new DynamoDB.DocumentClient(),
  hashGenerator: (password: string) => bcrypt.hashSync(password, 10),
  uuidGenerator: uuidV1,
  tableName: tableConfig.Unit.TableName,
  crudSdk:
    crudSdk ||
    CrudApi.getCrudSdkForIAM(
      process.env.API_ACCESS_KEY_ID || '',
      process.env.API_SECRET_ACCESS_KEY || '',
    ),
});
