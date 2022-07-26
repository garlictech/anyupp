// ############
// execute with:
// yarn ts-node --project ./tools/tsconfig.json -r tsconfig-paths/register ./tools/reindex-tables.ts

import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import { combineLatest, defer, from } from 'rxjs';
import { concatMap, delay, switchMap, tap, toArray } from 'rxjs/operators';
import * as cliProgress from 'cli-progress';
import AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { tableConfig } from '../libs/crud-gql/backend/src';

const docClient = new AWS.DynamoDB.DocumentClient();

// WARNING! The solution is NOT scalable, so after a couple of million items
// will be long and will fail! We have to solve the scaling by then.
const getAllRecords = async (tableName: string) => {
  console.log(`Getting all records in table ${tableName}`);
  const params: DocumentClient.ScanInput = {
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
  const params: DocumentClient.DeleteItemInput = {
    TableName: table,
    Key: {
      id: id,
    },
  };

  return docClient.delete(params).promise();
};

const putItem = (table: string, item: DocumentClient.PutItemInput) => {
  const params: DocumentClient.PutItemInput = {
    TableName: table,
    Item: {
      ...item,
      migrationTrigger: null,
      createdAt: '2021-08-03T12:19:42.272Z',
      updatedAt: '2021-08-03T12:19:42.272Z',
    },
  };

  return docClient.put(params).promise();
};

const triggerReindex = (
  table: string,
  id: string,
  item: DocumentClient.PutItemInput,
) => {
  return defer(() => from(deleteItem(table, id))).pipe(
    delay(3000),
    switchMap(() => from(putItem(table, item))),
  );
};

const multibar = new cliProgress.MultiBar(
  {
    clearOnComplete: false,
    hideCursor: true,
  },
  cliProgress.Presets.shades_grey,
);

const reindexAllInTable = (tableName: string) => {
  let progressBar: any;

  return defer(() => from(getAllRecords(tableName))).pipe(
    tap(items => (progressBar = multibar.create(items.length, 0))),
    switchMap(from),
    concatMap(item => triggerReindex(tableName, item.id, item)),
    tap(() => progressBar.increment()),
    toArray(),
  );
};

const reindexAllTables = () =>
  pipe(
    tableConfig,
    fp.omit(['default', '_closing_tag']),
    fp.mapValues('TableName'),
    fp.values,
    fp.map(reindexAllInTable),
    combineLatest,
  ).pipe(
    toArray(),
    tap(() => multibar.stop()),
  );

reindexAllTables().subscribe();
