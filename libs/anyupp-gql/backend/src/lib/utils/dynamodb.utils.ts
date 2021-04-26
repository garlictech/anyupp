import { from } from 'rxjs';

import {
  BatchWriteItemCommand,
  BatchWriteItemInput,
  DynamoDBClient,
  WriteRequest,
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { AWS_CRUD_CONFIG } from '@bgap/shared/graphql/api-client';
import { DateTime } from 'luxon';

const toBatchDeleteParam = (id: string): WriteRequest => ({
  DeleteRequest: { Key: { id: { S: id } } },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toBatchPutParam = (item: any): WriteRequest => ({
  PutRequest: {
    Item: marshall({
      ...item,
      createdAt: DateTime.utc().toString(),
      updatedAt: DateTime.utc().toString(),
    }),
  },
});

// TODO: split to chunks by 25 item + extract the logic and test it
const executeBatchWrite = (tablename: string) => (
  writeRequests: WriteRequest[],
) => {
  const dbClient = new DynamoDBClient({
    region: AWS_CRUD_CONFIG.aws_appsync_region,
  });

  const params: BatchWriteItemInput = {
    RequestItems: {
      [tablename]: writeRequests,
    },
  };

  // return from(dynamodb.batchWrite(params).promise());
  return from(dbClient.send(new BatchWriteItemCommand(params)));
};

// TODO: split to chunks by 25 item + extract the logic and test it
export const executeBatchDelete = (tablename: string) => (ids: Array<string>) =>
  executeBatchWrite(tablename)(ids.map(toBatchDeleteParam));

// TODO: split to chunks by 25 item + extract the logic and test it
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const executeBatchPut = (tablename: string) => (items: Array<any>) =>
  executeBatchWrite(tablename)(items.map(toBatchPutParam));
