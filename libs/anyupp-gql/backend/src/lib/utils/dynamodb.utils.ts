// TODO: further optimization could be achieved working with the metadata from the batch result
// {
//   "$metadata": {
//     "httpStatusCode": 200,
//     "requestId": "QAMPE2D05F8MJ59BHL48RAVJ97VV4KQNSO5AEMVJF66Q9ASUAAJG",
//     "attempts": 1,
//     "totalRetryDelay": 0
//   },
//   "UnprocessedItems": {}
// See https://medium.com/@ravishivt/batch-processing-with-rxjs-6408b0761f39
// See https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/batchwriteitemcommand.html
import { DateTime } from 'luxon';
import { from } from 'rxjs';
import { bufferCount, delay, map, mergeMap, toArray } from 'rxjs/operators';

import { AWS_CRUD_CONFIG } from '@bgap/shared/graphql/api-client';
import * as fp from 'lodash/fp';

import AWS from 'aws-sdk';
import { DocumentClient, WriteRequest } from 'aws-sdk/clients/dynamodb';

const DYNAMODB_BATCH_WRITE_ITEM_COUNT = 25;
const DYNAMODB_CONCURRENT_OPERATION_COUNT = 1;
const DYNAMODB_OPERATION_DELAY = 1000;

const toBatchDeleteParam = (id: string): WriteRequest => ({
  DeleteRequest: { Key: { id: { S: id } } },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toBatchPutParam = (item: any): WriteRequest => ({
  PutRequest: {
    Item: AWS.DynamoDB.Converter.marshall({
      ...item,
      createdAt: DateTime.utc().toString(),
      updatedAt: DateTime.utc().toString(),
    }),
  },
});

/** Returns all the results in a single emission */
const executeBatchWrite = (tablename: string) => (
  writeRequests: WriteRequest[],
) => {
  const dbClient = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    region: AWS_CRUD_CONFIG.aws_appsync_region,
  });

  return from(writeRequests).pipe(
    // SPLIT the operations into fix sized chunks
    bufferCount(DYNAMODB_BATCH_WRITE_ITEM_COUNT),
    map(toBatchWriteIteminput(tablename)),
    // EXECUTE fix amount of the operation concurrently
    mergeMap(
      params =>
        from(dbClient.batchWriteItem(params).promise()).pipe(
          delay(DYNAMODB_OPERATION_DELAY),
        ),
      DYNAMODB_CONCURRENT_OPERATION_COUNT,
    ),
    toArray(),
    map(fp.flatten),
  );
};
const toBatchWriteIteminput = (tablename: string) => (
  writeRequests: WriteRequest[],
): DocumentClient.BatchWriteItemInput => ({
  RequestItems: {
    [tablename]: writeRequests,
  },
});

export const executeBatchDelete = (tablename: string) => (ids: Array<string>) =>
  executeBatchWrite(tablename)(ids.map(toBatchDeleteParam));

export const executeBatchPut = (tablename: string) => (items: Array<unknown>) =>
  executeBatchWrite(tablename)(items.map(toBatchPutParam));
