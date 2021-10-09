import { Auth } from '@aws-amplify/auth';
import * as CrudApi from '@bgap/crud-gql/api';
import { AnyuppSdk } from '@bgap/anyupp-gql/api';
import { productRequestHandler } from '@bgap/anyupp-gql/backend';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  productFixture,
  testAdminUsername,
  testAdminUserPassword,
  testIdPrefix,
} from '@bgap/shared/fixtures';
import { RequiredId } from '@bgap/shared/types';
import { defer, iif, of, throwError } from 'rxjs';
import { catchError, delay, switchMap, takeLast } from 'rxjs/operators';
import {
  createAuthenticatedAnyuppSdk,
  createIamCrudSdk,
} from '../../../../api-clients';
import {
  createTestUnitProduct,
  deleteTestUnitProduct,
} from '../../../seeds/unit-product';
import { getUnitProduct } from './utils';

const DYNAMODB_OPERATION_DELAY = 3000;
const TEST_NAME = 'UPDATE_UNIT_PROD_';
const DEBUG_MODE_TEST_WITH_LOCALE_CODE = false;

const unitProduct: RequiredId<CrudApi.CreateUnitProductInput> = {
  ...productFixture.unitProductInputBase,
  id: `${testIdPrefix}${TEST_NAME}unitProduct_01`,
  unitId: 'UNIT_ID_TO_CRUD',
};
describe('UpdateUnitProduct tests', () => {
  let authAnyuppSdk: AnyuppSdk;
  const iamCrudSdk: CrudApi.CrudSdk = createIamCrudSdk();

  const cleanup = deleteTestUnitProduct(unitProduct.id, iamCrudSdk);

  beforeAll(async () => {
    authAnyuppSdk = await createAuthenticatedAnyuppSdk(
      testAdminUsername,
      testAdminUserPassword,
    )
      .toPromise()
      .then(x => x.authAnyuppSdk);

    await cleanup
      .pipe(
        takeLast(1),
        switchMap(() => createTestUnitProduct(unitProduct, iamCrudSdk)),
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

  it('should throw in case of an invalid input', done => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const input: any = { foo: 'NOT A VALID INPUT' };
    iif(
      () => DEBUG_MODE_TEST_WITH_LOCALE_CODE,
      defer(() =>
        productRequestHandler({
          crudSdk: iamCrudSdk,
          regenerateUnitDataHandler: jest.fn(),
        }).updateUnitProduct({ input }),
      ),
      authAnyuppSdk.UpdateUnitProduct({ input }),
    ).subscribe({
      next() {
        console.error(`${TEST_NAME}Test ERROR`, 'SHOULD NOT SUCCEED');
      },
      error(err) {
        expect(err).toMatchSnapshot();
        done();
      },
    });
  }, 15000);

  it('should throw because of the missing GroupProduct - ANYUPP_API CALL', done => {
    const input: CrudApi.UpdateUnitProductInput = {
      id: unitProduct.id,
      position: 10,
    };

    authAnyuppSdk
      .UpdateUnitProduct({ input })
      .pipe(
        delay(DYNAMODB_OPERATION_DELAY),
        switchMap(product => getUnitProduct(iamCrudSdk, product.id)),
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

  it('should update the unitProduct in the database and call the regeneration logic - LOCAL test', done => {
    const regenMockHandler = jest.fn().mockReturnValue(of(true));
    const input: CrudApi.UpdateUnitProductInput = {
      id: unitProduct.id,
      position: 10,
    };

    defer(() =>
      productRequestHandler({
        crudSdk: iamCrudSdk,
        regenerateUnitDataHandler: regenMockHandler,
      }).updateUnitProduct({
        input,
      }),
    )
      .pipe(
        delay(DYNAMODB_OPERATION_DELAY),
        switchMap(product => getUnitProduct(iamCrudSdk, product.id)),
      )
      .subscribe({
        next(result) {
          const { createdAt, updatedAt, ...product } = result;
          expect(createdAt).not.toBeUndefined();
          expect(updatedAt).not.toBeUndefined();
          expect(product).toMatchSnapshot('POSITION SHOULD BE 10');

          // Regeneration check
          expect(regenMockHandler).toBeCalled();
          expect(regenMockHandler).toHaveBeenNthCalledWith(
            1,
            unitProduct.unitId,
          );
          done();
        },
      });
  }, 25000);
});
