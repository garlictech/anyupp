import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { IUnit } from '@bgap/shared/types';

import {
  executeBatchDelete,
  executeBatchPut,
  executeUpdateItem,
} from '../utils';

/**
 * It increments a number in the database and calculates it's modulus with the given modulo
 * to get the next Order number.
 *
 * It is cheeper to allways incement and calculate the modulo than to update and check and reset the counter
 *
 * examples with the default modulo (100)
 *  88 => 88
 *  121 => 21
 *  4800 =>  0
 *  4834 => 34
 *
 * @param tableName TableName to store the lastOrderNum field
 * @param id Id to which document will be the lastOrdernum field stored
 * @param modulo The size of the counter before reset
 * @returns the next Order number to use
 */
export const incrementOrderNum = <Table>(tableName: string) => (
  id: string,
  modulo = 100,
): Observable<number | undefined> => {
  // TODO: extract this logic somewhere as Increment
  return executeUpdateItem<Pick<IUnit, 'lastOrderNum'>>({
    TableName: tableName,
    Key: { id: { S: id } },
    // UpdateExpression: 'set lastOrderNum = lastOrderNum + :val',
    UpdateExpression: 'add lastOrderNum :val',
    ExpressionAttributeValues: {
      ':val': { N: '1' },
    },
    ReturnValues: 'UPDATED_NEW',
  }).pipe(map(x => (x.lastOrderNum ? x.lastOrderNum % modulo : undefined)));
};

export const deleteItems = (tableName: string) => (
  items: Array<{ id: string }>,
) =>
  of(items).pipe(
    map(items => items.map(x => x.id)),
    switchMap(executeBatchDelete(tableName)),
    tap({
      next() {
        console.log(
          `deleteItems in the ${tableName} table EXECUTED, ${items.length} item deleted`,
        );
      },
    }),
  );

export const createItems = (tableName: string) => (items: Array<unknown>) =>
  executeBatchPut(tableName)(items);
