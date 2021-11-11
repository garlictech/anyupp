import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { pipe } from 'fp-ts/lib/function';
import * as R from 'ramda';

// Creates a dynamodb update expression for Document Client.
// Assumes, that the key name is id...
export const createUpdateParams = <T>(
  TableName: string,
  id: string,
  item: T,
): DocumentClient.UpdateItemInput =>
  pipe(item, R.omit(['id']), (newItem: Record<string, unknown>) => ({
    TableName,
    Key: { id },
    UpdateExpression:
      'set ' +
      Object.keys(newItem)
        .map(k => `#${k} = :${k}`)
        .join(', '),
    ExpressionAttributeNames: Object.entries(newItem).reduce(
      (acc, cur) => ({ ...acc, [`#${cur[0]}`]: cur[0] }),
      {},
    ),
    ExpressionAttributeValues: Object.entries(newItem).reduce(
      (acc, cur) => ({ ...acc, [`:${cur[0]}`]: cur[1] }),
      {},
    ),
    ReturnValues: 'ALL_NEW',
  }));
