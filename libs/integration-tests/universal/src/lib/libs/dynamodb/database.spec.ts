/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { switchMap, tap } from 'rxjs/operators';

import { incrementOrderNum } from '@bgap/anyupp-gql/backend';
import { CrudApi } from '@bgap/crud-gql/api';
import { tableConfig } from '@bgap/crud-gql/backend';
import { testIdPrefix, unitSeed } from '@bgap/shared/fixtures';
import { RequiredId } from '@bgap/shared/types';

import { createTestUnit, deleteTestUnit } from '../../seeds/unit';

const UNIT_TABLE_NAME = tableConfig.Unit.TableName;

const unit_01: RequiredId<CrudApi.CreateUnitInput> = {
  ...unitSeed.unit_01,
  id: `${testIdPrefix}unit_dbtest_id`,
  lastOrderNum: undefined,
};

describe('Dynamo DB function tests', () => {
  describe('incrementOrderNum on Unit', () => {
    it('should increment without existing lastOrderNum field on the Unit', done => {
      deleteTestUnit(unit_01.id)
        .pipe(
          switchMap(() => createTestUnit(unit_01)),
          switchMap(() => incrementOrderNum(UNIT_TABLE_NAME)(unit_01.id)),
        )
        .subscribe({
          next(next) {
            expect(next).toEqual(1);
            done();
          },
          error(err) {
            console.error(err);
          },
        });
    }, 5000);

    it('should increment and reset to 0 in case the next orderNum is 100', done => {
      deleteTestUnit(unit_01.id)
        .pipe(
          switchMap(() => createTestUnit({ ...unit_01, lastOrderNum: 398 })),
          switchMap(() => incrementOrderNum(UNIT_TABLE_NAME)(unit_01.id)),
          tap({
            next(lastOrderNum) {
              expect(lastOrderNum).toEqual(99);
            },
          }),
          switchMap(() => incrementOrderNum(UNIT_TABLE_NAME)(unit_01.id)),
          tap({
            next(lastOrderNum) {
              expect(lastOrderNum).toEqual(0);
            },
          }),
          switchMap(() => incrementOrderNum(UNIT_TABLE_NAME)(unit_01.id)),
        )
        .subscribe({
          next(lastOrderNum) {
            expect(lastOrderNum).toEqual(1);
            done();
          },
          error(err) {
            console.error(err);
          },
        });
    }, 5000);
  });
});
