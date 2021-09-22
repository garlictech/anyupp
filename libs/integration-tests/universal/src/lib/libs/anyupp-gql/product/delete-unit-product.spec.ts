import { Auth } from '@aws-amplify/auth';
import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { productRequestHandler } from '@bgap/anyupp-gql/backend';
import * as CrudApi from '@bgap/crud-gql/api';
import { productFixture } from '@bgap/shared/fixtures';
import { RequiredId } from '@bgap/shared/types';
import { defer, of, throwError } from 'rxjs';
import { catchError, delay, switchMap, takeLast, tap } from 'rxjs/operators';
import { createIamCrudSdk } from '../../../../api-clients';
import {
  createTestUnitProduct,
  deleteTestUnitProduct,
} from '../../../seeds/unit-product';
import { getUnitProduct } from './utils';

const DYNAMODB_OPERATION_DELAY = 3000;
const TEST_NAME = 'DELETE_UNIT_PROD_';
// const DEBUG_MODE_TEST_WITH_LOCALE_CODE = false;

const input: RequiredId<AnyuppApi.CreateUnitProductInput> = {
  ...productFixture.unitProductInputBase,
  unitId: 'UNIT_ID_TO_CRUD',
};

describe('DeleteUnitProduct tests', () => {
  const iamCrudSdk: CrudApi.CrudSdk = createIamCrudSdk();

  const cleanup = deleteTestUnitProduct(input.id, iamCrudSdk);

  beforeAll(async () => {
    await cleanup
      .pipe(
        takeLast(1),
        switchMap(() => createTestUnitProduct(input, iamCrudSdk)),
        takeLast(1),
        catchError(err => {
          console.error('BEFORE HOOK ERROR');
          return throwError(err);
        }),
      )
      .toPromise();
  });

  afterAll(async () => {
    await cleanup.toPromise();
    await Auth.signOut();
  });

  it('should delete the unitProduct from the database', done => {
    const regenMockHandler = jest.fn().mockReturnValue(of(true));

    defer(() =>
      productRequestHandler({
        crudSdk: iamCrudSdk,
        regenerateUnitDataHandler: regenMockHandler,
      }).deleteUnitProduct({
        id: input.id,
      }),
    )
      .pipe(
        tap({
          next(result) {
            expect(result).toEqual(true);
          },
        }),
        delay(DYNAMODB_OPERATION_DELAY),
        switchMap(_ => getUnitProduct(iamCrudSdk, input.id)),
      )
      .subscribe({
        next() {
          console.error(`${TEST_NAME}Test ERROR`, 'SHOULD NOT SUCCEED');
        },
        error(err) {
          expect(err).toMatchSnapshot();
          done();
        },
      });
  }, 25000);
});
