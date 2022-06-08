import { switchMap, tap } from 'rxjs/operators';

import { tableConfig } from '@bgap/crud-gql/backend';
import { testIdPrefix, unitFixture } from '@bgap/shared/fixtures';
import { RequiredId } from '@bgap/shared/types';

import { createTestUnit, deleteTestUnit } from '../../seeds/unit';
import { createIamCrudSdk } from '../../../api-clients';
import { incrementOrderNum } from '@bgap/anyupp-backend-lib';
import { CreateUnitInput } from '@bgap/domain';

const UNIT_TABLE_NAME = tableConfig.Unit.TableName;
const TEST_NAME = 'DYNAMO_DB_TEST_';

const unit_01: RequiredId<CreateUnitInput> = {
  ...unitFixture.createUnit_01,
  id: `${testIdPrefix}unit_${TEST_NAME}_id`,
  lastOrderNum: undefined,
};

describe('Dynamo DB function tests', () => {
  const crudSdk = createIamCrudSdk();

  const cleanup = () => deleteTestUnit(unit_01.id, crudSdk);

  afterAll(async () => {
    await cleanup().toPromise();
  }, 60000);

  describe('incrementOrderNum on Unit', () => {
    it('should increment without existing lastOrderNum field on the Unit', done => {
      deleteTestUnit(unit_01.id, crudSdk)
        .pipe(
          switchMap(() => createTestUnit(unit_01, crudSdk)),
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
    }, 60000);

    it('should increment and reset to 0 in case the next orderNum is 100', done => {
      deleteTestUnit(unit_01.id, crudSdk)
        .pipe(
          switchMap(() =>
            createTestUnit({ ...unit_01, lastOrderNum: 398 }, crudSdk),
          ),
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
    }, 60000);
  });
});
