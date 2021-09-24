import * as CrudApi from '@bgap/crud-gql/api';
import { Context, Handler } from 'aws-lambda';
import bcrypt from 'bcryptjs';
import { tableConfig } from '@bgap/crud-gql/backend';
import AWS from 'aws-sdk';
import { Observable } from 'rxjs';
import { v1 as uuidV1 } from 'uuid';
import {
  UnitResolverDeps,
  createUnitResolver,
  updateUnitResolver,
} from '@bgap/crud-gql/backend';

const salt = process.env.SALT || '';

const docClient = new AWS.DynamoDB.DocumentClient();

//const hashGenerator = (password: string) => bcrypt.hashSync(password, salt);
const hashGenerator = (password: string) => bcrypt.hashSync(password, 10);

const uuidGenerator = uuidV1;

const unitDeps: UnitResolverDeps = {
  hashGenerator,
  uuidGenerator,
  tableName: tableConfig.Unit.TableName,
  docClient,
};

interface Event {
  typeName: string;
  fieldName: string;
  arguments: unknown;
  source: unknown;
}

const resolverMap: any = {
  /*Mutation: {
    // We trust Apollo at this point... validate the assumptions implemented
    // in the casts with integration tests!
    createUnit: x => createUnitResolver(unitDeps)(x as CrudApi.CreateUnitInput),
    updateUnit: x => updateUnitResolver(unitDeps)(x as CrudApi.UpdateUnitInput),
  },*/
  RKeeper: {
    rkeeperPassword: (source: CrudApi.RKeeper) =>
      hashGenerator(source.rkeeperPassword),
    anyuppPassword: (source: CrudApi.RKeeper) =>
      hashGenerator(source.anyuppPassword),
  },
};

export const handler: Handler<Event, unknown> = (
  event: Event,
  _context: Context,
) => {
  console.log('****', event);
  /*return (
    resolverMap[event.typeName]?.[event.fieldName]?.(event.source) ??
    Promise.reject('Wrong input')
  );*/
  return Promise.resolve('HASHED');
};
