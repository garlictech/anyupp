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

const hashGenerator = async (password: string) =>
  await bcrypt.hash(password, salt);

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
}

const resolverMap: Record<
  string,
  Record<string, (arg: unknown) => Observable<unknown>>
> = {
  Mutation: {
    // We trust Apollo at this point... validate the assumptions implemented
    // in the casts with integration tests!
    createUnit: x => createUnitResolver(unitDeps)(x as CrudApi.CreateUnitInput),
    updateUnit: x => updateUnitResolver(unitDeps)(x as CrudApi.UpdateUnitInput),
  },
};

export const handler: Handler<Event, unknown> = (
  event: Event,
  _context: Context,
) => {
  return (
    resolverMap[event.typeName]
      ?.[event.fieldName]?.(event.arguments)
      ?.toPromise() ?? Promise.reject('Wrong input')
  );
};
