import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import { combineLatest, concat, defer, from } from 'rxjs';
import { concatMap, delay, switchMap, tap, toArray } from 'rxjs/operators';
import { v1 as uuidV1 } from 'uuid';
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

const triggerReindex = (table: string, id: string) => {
  const params: DocumentClient.Update = {
    TableName: table,
    Key: {
      id: id,
    },
    UpdateExpression: 'set migrationTrigger = :uuid',
    ExpressionAttributeValues: {
      ':uuid': uuidV1(),
    },
  };

  return docClient.update(params).promise();
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
    concatMap(item => defer(() => from(triggerReindex(tableName, item.id)))),
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
