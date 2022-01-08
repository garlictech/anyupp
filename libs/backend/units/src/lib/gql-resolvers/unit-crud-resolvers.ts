import bcrypt from 'bcryptjs';
import { v1 as uuidV1 } from 'uuid';
import { tableConfig } from '@bgap/crud-gql/backend';
import * as CrudApi from '@bgap/crud-gql/api';
import { createUpdateParams, throwIfEmptyValue } from '@bgap/shared/utils';
import { pipe, flow } from 'fp-ts/lib/function';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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
      item => createUpdateParams(deps.tableName, args.input.id, item),
      item => ({
        ...item,
        updatedAt: new Date().toISOString(),
      }),
      item => from(deps.docClient.update(item).promise()),
      map(res => res?.Attributes as CrudApi.Unit),
    );

export const updateUnitRKeeperDataResolver =
  (deps: UnitsResolverDeps) =>
  (
    args: CrudApi.MutationUpdateUnitRKeeperDataArgs,
  ): ReturnType<CrudApi.CrudSdk['UpdateUnitRKeeperData']> =>
    pipe(
      deps.crudSdk.GetUnit({ id: args.input.unitId }),
      map(unit => unit?.pos?.rkeeper),
      throwIfEmptyValue('Unit does not exists or it is not an rkeeper unit'),
      map(rkeeper => ({
        ...rkeeper,
        ...flow(R.omit(['unitId']), R.reject(R.isNil))(args.input),
        anyuppPassword: args.input.anyuppPassword
          ? deps.hashGenerator(args.input.anyuppPassword)
          : rkeeper.anyuppPassword,
      })),
      map((rkeeper: CrudApi.RKeeperInput) => ({
        input: {
          id: args.input.unitId,
          pos: {
            type: CrudApi.PosType.rkeeper,
            rkeeper,
          },
        },
      })),
      switchMap(updateUnitResolver(deps)),
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
