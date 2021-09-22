import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { AnyuppSdk, getAnyuppSdkPublic } from '@bgap/anyupp-gql/api';
import { productRequestHandler } from '@bgap/anyupp-gql/backend';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  productFixture,
  testAdminUsername,
  testAdminUserPassword,
  testIdPrefix,
} from '@bgap/shared/fixtures';
import { RequiredId } from '@bgap/shared/types';
import { Auth } from 'aws-amplify';
import { combineLatest, defer, iif, of } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import {
  createAuthenticatedAnyuppSdk,
  createIamCrudSdk,
} from '../../../../api-clients';
import { deleteTestUnitProduct } from '../../../seeds/unit-product';
import { getUnitProduct } from './utils';

const DYNAMODB_OPERATION_DELAY = 3000;
const TEST_NAME = 'CREATE_UNIT_PROD_';
const DEBUG_MODE_TEST_WITH_LOCALE_CODE = false;

const unitProduct: RequiredId<AnyuppApi.CreateUnitProductInput> = {
  ...productFixture.unitProductInputBase,
  id: `${testIdPrefix}${TEST_NAME}unitProduct_01`,
  unitId: 'UNIT_ID_TO_CRUD',
};
describe('CreateUnitProduct tests', () => {
  let publicAnyuppSdk: AnyuppSdk;
  let authAnyuppSdk: AnyuppSdk;
  const iamCrudSdk: CrudApi.CrudSdk = createIamCrudSdk();

  const cleanup = deleteTestUnitProduct(unitProduct.id, iamCrudSdk);

  beforeAll(async () => {
    publicAnyuppSdk = getAnyuppSdkPublic();
    authAnyuppSdk = await createAuthenticatedAnyuppSdk(
      testAdminUsername,
      testAdminUserPassword,
    )
      .toPromise()
      .then(x => x.authAnyuppSdk);
    await cleanup.toPromise();
  }, 10000);

  afterAll(async () => {
    await cleanup.toPromise();
    await Auth.signOut();
  }, 10000);

  it('should require authentication to access', done => {
    publicAnyuppSdk.CreateUnitProduct({ input: unitProduct }).subscribe({
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  }, 25000);

  describe('with authenticated user', () => {
    beforeAll(async () => {
      await combineLatest([
        // CleanUP
        deleteTestUnitProduct(unitProduct.id, iamCrudSdk),
      ]).toPromise();
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
          }).createUnitProduct({ input }),
        ),
        authAnyuppSdk.CreateUnitProduct({ input }),
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

    it('should create unitProduct in the database', done => {
      const regenMockHandler = jest.fn().mockReturnValue(of(true));

      defer(() =>
        productRequestHandler({
          crudSdk: iamCrudSdk,
          regenerateUnitDataHandler: regenMockHandler,
        }).createUnitProduct({ input: unitProduct }),
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
            expect(product).toMatchSnapshot();

            // Regeneration check
            expect(regenMockHandler).toBeCalled();
            expect(regenMockHandler).toHaveBeenNthCalledWith(
              1,
              unitProduct.unitId,
            );
            done();
          },
          error(err) {
            console.error(`${TEST_NAME}Test ERROR`, err);
          },
        });
    }, 25000);
  });
});
