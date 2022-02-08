import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import { combineLatest, defer, from } from 'rxjs';
import { concatMap, delay, switchMap, tap, toArray } from 'rxjs/operators';
import { DynamoDB } from 'aws-sdk';
import { tableConfig } from '@bgap/crud-gql/backend';

const docClient = new DynamoDB.DocumentClient();

// Based on https://stackoverflow.com/questions/51110377/delete-all-items-in-dynamodb-using-lambda
const getAllRecords = async (tableName: string) => {
  console.log(`Getting all records in table ${tableName}`);
  const params: DynamoDB.DocumentClient.ScanInput = {
    TableName: tableName,
  };

  let data = await docClient.scan(params).promise();
  let items = data.Items || [];

  while (typeof data.LastEvaluatedKey != 'undefined') {
    params.ExclusiveStartKey = data.LastEvaluatedKey;
    data = await from(docClient.scan(params).promise())
      .pipe(delay(2000))
      .toPromise();
    items = [...items, ...(data.Items || [])];
  }

  console.log(`found ${items.length} items in ${tableName}`);
  return items;
};

const deleteItem = (table: string, id: string) => {
  const params: DynamoDB.DocumentClient.DeleteItemInput = {
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
    tap(() => console.log(`Data deleted from table ${tableName}`)),
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
