import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import { combineLatest, defer, from } from 'rxjs';
import { concatMap, switchMap, toArray } from 'rxjs/operators';

import AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { tableConfig } from '@bgap/crud-gql/backend';

const docClient = new AWS.DynamoDB.DocumentClient();

// BAsed on https://stackoverflow.com/questions/51110377/delete-all-items-in-dynamodb-using-lambda
const getAllRecords = async (tableName: string) => {
  const params: DocumentClient.ScanInput = {
    TableName: tableName,
  };

  let data = await docClient.scan(params).promise();
  let items = data.Items || [];

  while (typeof data.LastEvaluatedKey != 'undefined') {
    params.ExclusiveStartKey = data.LastEvaluatedKey;
    data = await docClient.scan(params).promise();
    items = [...items, ...(data.Items || [])];
  }

  return items;
};

const deleteItem = (table: string, id: string) => {
  const params: DocumentClient.DeleteItemInput = {
    TableName: table,
    Key: {
      id: id,
    },
  };

  return docClient.delete(params).promise();
};

const deleteAllInTable = (tableName: string) =>
  defer(() => from(getAllRecords(tableName))).pipe(
    switchMap(from),
    concatMap(item => defer(() => from(deleteItem(tableName, item.id)))),
    toArray(),
  );

export const deleteInAllTables = () =>
  pipe(
    tableConfig,
    fp.omit(['default', '_closing_tag']),
    fp.mapValues('TableName'),
    fp.values,
    fp.map(deleteAllInTable),
    combineLatest,
  );
