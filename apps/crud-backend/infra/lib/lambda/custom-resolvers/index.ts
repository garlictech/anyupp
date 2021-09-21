import { Context, Handler } from 'aws-lambda';
import bcrypt from 'bcryptjs';
import { tableConfig } from '@bgap/crud-gql/backend';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import AWS from 'aws-sdk';
import * as CrudApi from '@bgap/crud-gql/api';
import { pipe } from 'fp-ts/lib/function';
import { from } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';

const docClient = new AWS.DynamoDB.DocumentClient();

const hashGenerator = async (password: string) =>
  await bcrypt.hash(password, 10);

export const hashRkeeperPasswords =
  (pos: CrudApi.Pos | undefined, password: string) =>
  (hashGeneratorFv: typeof hashGenerator) => {
    return pos?.rkeeper
      ? {
          rkeeper: {
            ...pos.rkeeper,
            rkeeperPassword: hashGeneratorFv(password),
          },
        }
      : undefined;
  };

interface Event {
  arguments: {
    unitId: string;
    password: string;
  };
}

export const handler: Handler<Event, unknown> = (
  event: Event,
  _context: Context,
) => {
  return pipe(
    {
      TableName: tableConfig.Unit.TableName,
      Key: {
        id: event.arguments.unitId,
      },
    },
    params => from(docClient.get(params).promise()),
    map(unit =>
      hashRkeeperPasswords(
        unit.Item?.pos,
        event.arguments.password,
      )(hashGenerator),
    ),
    map(
      (rkeeper): DocumentClient.UpdateItemInput => ({
        TableName: tableConfig.Unit.TableName,
        Key: {
          id: event.arguments.unitId,
        },
        AttributeUpdates: {
          pos: {
            Value: { rkeeper },
          },
        },
      }),
    ),
    switchMap(params => from(docClient.update(params).promise())),
    mapTo(true),
  ).toPromise();
};
