import { DynamoDB } from 'aws-sdk';
import { Key } from 'aws-sdk/clients/dynamodb';
import * as R from 'ramda';
import { EMPTY, from } from 'rxjs';
import {
  expand,
  last,
  map,
  mergeMap,
  reduce,
  switchMap,
  takeLast,
  toArray,
} from 'rxjs/operators';

import { tableConfig } from '../libs/crud-gql/backend/src';

const chainId: string = process.argv[2];
const docClient = new DynamoDB.DocumentClient();

const getChainScanParams = (
  table: string,
  chainId: string,
): DynamoDB.DocumentClient.ScanInput => ({
  TableName: table,
  FilterExpression: 'chainId = :chainId',
  ExpressionAttributeValues: {
    ':chainId': chainId,
  },
  Limit: 50,
});

const getUnitScanParams = (
  table: string,
  unitId: string,
): DynamoDB.DocumentClient.ScanInput => ({
  TableName: table,
  FilterExpression: 'unitId = :unitId',
  ExpressionAttributeValues: {
    ':unitId': unitId,
  },
  Limit: 50,
});

const scanTable$ = (
  params: DynamoDB.DocumentClient.ScanInput,
  startKey?: Key | null,
) =>
  from(
    docClient
      .scan({
        ...params,
        ...(startKey ? { ExclusiveStartKey: startKey } : {}),
      })
      .promise(),
  );

const getAllItemIdsFromTable$ = (
  scanParams: DynamoDB.DocumentClient.ScanInput,
) =>
  scanTable$(scanParams).pipe(
    expand(result =>
      result?.LastEvaluatedKey
        ? scanTable$(scanParams, result.LastEvaluatedKey)
        : EMPTY,
    ),
    reduce(
      (acc: string[], result) =>
        R.concat(acc)(result?.Items?.map(i => i.id) ?? []),
      [],
    ),
    takeLast(1),
  );

const deleteItem$ = (table: string, id: string) =>
  from(
    docClient
      .delete({
        TableName: table,
        Key: {
          id: id,
        },
      })
      .promise(),
  );

from([
  tableConfig.ChainProduct.TableName,
  tableConfig.GroupProduct.TableName,
  tableConfig.UnitProduct.TableName,
  tableConfig.ProductComponent.TableName,
  tableConfig.ProductComponentSet.TableName,
])
  .pipe(
    mergeMap(tableName =>
      getAllItemIdsFromTable$(getChainScanParams(tableName, chainId)).pipe(
        switchMap(itemIds => from(itemIds)),
        map(id => deleteItem$(tableName, id)),
        toArray(),
        map(items => {
          console.error(`${items.length} items deleted from ${tableName}.`);
        }),
      ),
    ),
    last(), // Wait for mergeMap items
    // Get units from the chain
    switchMap(() =>
      getAllItemIdsFromTable$(
        getChainScanParams(tableConfig.Unit.TableName, chainId),
      ).pipe(switchMap(itemIds => from(itemIds))),
    ),
    mergeMap(unitId =>
      getAllItemIdsFromTable$(
        getUnitScanParams(tableConfig.GeneratedProduct.TableName, unitId),
      ).pipe(
        switchMap(itemIds => from(itemIds)),
        map(id => deleteItem$(tableConfig.GeneratedProduct.TableName, id)),
        toArray(),
        map(items => {
          console.error(
            `${items.length} generated products deleted from the ${unitId} unit.`,
          );
        }),
      ),
    ),
  )
  .subscribe();
