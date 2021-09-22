import Auth from '@aws-amplify/auth';
import * as AnyuppApi from '@bgap/anyupp-gql/api';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  productFixture,
  testAdminUsername,
  testAdminUserPassword,
  testIdPrefix,
} from '@bgap/shared/fixtures';
import { RequiredId } from '@bgap/shared/types';
import { productRequestHandler } from 'libs/anyupp-gql/backend/src';
import { combineLatest, concat, defer, iif, of, throwError } from 'rxjs';
import {
  catchError,
  delay,
  switchMap,
  takeLast,
  toArray,
} from 'rxjs/operators';
import {
  createAuthenticatedAnyuppSdk,
  createIamCrudSdk,
} from '../../../../api-clients';
import {
  createTestChainProduct,
  deleteTestChainProduct,
} from '../../../seeds/chain-product';
import {
  createTestGroupProduct,
  deleteTestGroupProduct,
} from '../../../seeds/group-product';
import {
  createTestUnitProduct,
  deleteTestUnitProduct,
} from '../../../seeds/unit-product';
import { getChainProduct, getGroupProduct } from './utils';

const TEST_NAME = 'UPDATE_CHAIN_GROUP_PROD_';
const DEBUG_MODE_TEST_WITH_LOCALE_CODE = false;
const DYNAMODB_OPERATION_DELAY = 3000;
const unitId_01 = `${testIdPrefix}${TEST_NAME}UNIT_ID_01`;
const unitId_02 = `${testIdPrefix}${TEST_NAME}UNIT_ID_02`;

// PRODUCTS to create
const chainProduct_01: RequiredId<CrudApi.CreateChainProductInput> = {
  ...productFixture.chainProductInputBase,
  id: `${testIdPrefix}${TEST_NAME}chainProduct_01`,
};
const chainProduct_02_WITH_NO_CHILD: RequiredId<CrudApi.CreateChainProductInput> =
  {
    ...productFixture.chainProductInputBase,
    id: `${testIdPrefix}${TEST_NAME}chainProduct_02`,
  };
const groupProduct_01: RequiredId<CrudApi.CreateGroupProductInput> = {
  ...productFixture.groupProductInputBase,
  id: `${testIdPrefix}${TEST_NAME}groupProduct_01`,
  parentId: chainProduct_01.id,
};
const groupProduct_02: RequiredId<CrudApi.CreateGroupProductInput> = {
  ...productFixture.groupProductInputBase,
  id: `${testIdPrefix}${TEST_NAME}groupProduct_02`,
  parentId: chainProduct_01.id,
};
const groupProduct_03_WITH_NO_CHILD: RequiredId<CrudApi.CreateGroupProductInput> =
  {
    ...productFixture.groupProductInputBase,
    id: `${testIdPrefix}${TEST_NAME}groupProduct_03`,
    parentId: chainProduct_01.id,
  };

const unitProduct_u01_gp01_01: RequiredId<CrudApi.CreateUnitProductInput> = {
  ...productFixture.unitProductInputBase,
  id: `${testIdPrefix}${TEST_NAME}unitProduct_01`,
  parentId: groupProduct_01.id,
  unitId: unitId_01,
};
const unitProduct_u01_gp02_02: RequiredId<CrudApi.CreateUnitProductInput> = {
  ...productFixture.unitProductInputBase,
  id: `${testIdPrefix}${TEST_NAME}unitProduct_02`,
  parentId: groupProduct_02.id,
  unitId: unitId_01,
};
const unitProduct_u02_gp01_03: RequiredId<CrudApi.CreateUnitProductInput> = {
  ...productFixture.unitProductInputBase,
  id: `${testIdPrefix}${TEST_NAME}unitProduct_03`,
  parentId: groupProduct_01.id,
  unitId: unitId_02,
};

describe('Update Chain and Group product tests', () => {
  let authAnyuppSdk: AnyuppApi.AnyuppSdk;

  const iamCrudSdk = createIamCrudSdk();

  const cleanup = concat(
    // CleanUP
    deleteTestUnitProduct(unitProduct_u01_gp01_01.id, iamCrudSdk),
    deleteTestUnitProduct(unitProduct_u01_gp02_02.id, iamCrudSdk),
    deleteTestUnitProduct(unitProduct_u02_gp01_03.id, iamCrudSdk),
    deleteTestGroupProduct(groupProduct_01.id, iamCrudSdk),
    deleteTestGroupProduct(groupProduct_02.id, iamCrudSdk),
    deleteTestGroupProduct(groupProduct_03_WITH_NO_CHILD.id, iamCrudSdk),
    deleteTestChainProduct(chainProduct_01.id, iamCrudSdk),
    deleteTestChainProduct(chainProduct_02_WITH_NO_CHILD.id, iamCrudSdk),
  ).pipe(toArray());

  beforeAll(async () => {
    authAnyuppSdk = await createAuthenticatedAnyuppSdk(
      testAdminUsername,
      testAdminUserPassword,
    )
      .toPromise()
      .then(x => x.authAnyuppSdk);

    await cleanup
      .pipe(
        delay(DYNAMODB_OPERATION_DELAY),
        takeLast(1),
        switchMap(() =>
          // Seeding
          combineLatest([
            createTestChainProduct(chainProduct_01, iamCrudSdk),
            createTestChainProduct(chainProduct_02_WITH_NO_CHILD, iamCrudSdk),
            createTestGroupProduct(groupProduct_01, iamCrudSdk),
            createTestGroupProduct(groupProduct_02, iamCrudSdk),
            createTestGroupProduct(groupProduct_03_WITH_NO_CHILD, iamCrudSdk),
            createTestUnitProduct(unitProduct_u01_gp01_01, iamCrudSdk),
            createTestUnitProduct(unitProduct_u01_gp02_02, iamCrudSdk),
            createTestUnitProduct(unitProduct_u02_gp01_03, iamCrudSdk),
          ]),
        ),
        takeLast(1),
        delay(DYNAMODB_OPERATION_DELAY),
        catchError(err => {
          console.error('BEFORE HOOK ERROR');
          return throwError(err);
        }),
      )
      .toPromise();
  }, 25000);

  afterAll(async () => {
    await cleanup.toPromise();
    await Auth.signOut();
  });

  describe('GroupProduct Update', () => {
    it('should throw in case of an invalid input', done => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const input: any = { foo: 'NOT A VALID INPUT' };
      iif(
        () => DEBUG_MODE_TEST_WITH_LOCALE_CODE,
        defer(() =>
          productRequestHandler({
            crudSdk: iamCrudSdk,
            regenerateUnitDataHandler: jest.fn(),
          }).updateGroupProduct({ input }),
        ),
        authAnyuppSdk.UpdateGroupProduct({ input }),
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

    it('should update the groupProduct in the database and call the regenereation logic for every unit', done => {
      const regenMockHandler = jest.fn().mockReturnValue(of(true));
      const input: AnyuppApi.UpdateGroupProductInput = {
        id: groupProduct_01.id,
        tax: 999,
      };

      defer(() =>
        productRequestHandler({
          crudSdk: iamCrudSdk,
          regenerateUnitDataHandler: regenMockHandler,
        }).updateGroupProduct({
          input,
        }),
      )
        .pipe(
          delay(DYNAMODB_OPERATION_DELAY),
          switchMap(product => getGroupProduct(iamCrudSdk, product.id)),
        )
        .subscribe({
          next(result) {
            const { createdAt, updatedAt, ...product } = result;
            expect(createdAt).not.toBeUndefined();
            expect(updatedAt).not.toBeUndefined();
            expect(product.id).toEqual(groupProduct_01.id);
            expect(product.tax).toEqual(999);
            expect(product).toMatchSnapshot('TAX SHOULD BE 999');

            // Regeneration check
            expect(regenMockHandler).toBeCalledTimes(2);
            const allTheCallArguments = regenMockHandler.mock.calls.map(
              call => call[0],
            );
            expect(allTheCallArguments).toHaveLength(2);
            expect(allTheCallArguments).toContain(
              unitProduct_u01_gp01_01.unitId,
            );
            expect(allTheCallArguments).toContain(
              unitProduct_u02_gp01_03.unitId,
            );
            done();
          },
        });
    }, 25000);

    it('should NOT fail in case there is no extended UnitProduct for the given GroupProduct', done => {
      const regenMockHandler = jest.fn().mockReturnValue(of(true));
      const input: AnyuppApi.UpdateGroupProductInput = {
        id: groupProduct_03_WITH_NO_CHILD.id,
      };

      iif(
        () => DEBUG_MODE_TEST_WITH_LOCALE_CODE,
        defer(() =>
          productRequestHandler({
            crudSdk: iamCrudSdk,
            regenerateUnitDataHandler: regenMockHandler,
          }).updateGroupProduct({
            input,
          }),
        ),
        authAnyuppSdk.UpdateGroupProduct({ input }),
      ).subscribe({
        next(product) {
          expect(product).not.toBeUndefined();
          expect(product.id).toEqual(groupProduct_03_WITH_NO_CHILD.id);

          expect(regenMockHandler).not.toBeCalled();
          done();
        },
        error(err) {
          console.error(`${TEST_NAME}Test ERROR`, err);
        },
      });
    }, 25000);
  });

  describe('ChainProduct Update', () => {
    it('should throw in case of an invalid input', done => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const input: any = { foo: 'NOT A VALID INPUT' };
      iif(
        () => DEBUG_MODE_TEST_WITH_LOCALE_CODE,
        defer(() =>
          productRequestHandler({
            crudSdk: iamCrudSdk,
            regenerateUnitDataHandler: jest.fn(),
          }).updateChainProduct({ input }),
        ),
        authAnyuppSdk.UpdateChainProduct({ input }),
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

    it('should update the chainProduct in the database and call the regenereation logic for every unit', done => {
      const regenMockHandler = jest.fn().mockReturnValue(of(true));
      const input: AnyuppApi.UpdateChainProductInput = {
        id: chainProduct_01.id,
        description: { en: 'UPDATED_DESCRIPTION' },
      };

      defer(() =>
        productRequestHandler({
          crudSdk: iamCrudSdk,
          regenerateUnitDataHandler: regenMockHandler,
        }).updateChainProduct({
          input,
        }),
      )
        .pipe(
          delay(DYNAMODB_OPERATION_DELAY),
          switchMap(() => getChainProduct(iamCrudSdk, input.id)),
        )
        .subscribe({
          next(result) {
            const { createdAt, updatedAt, ...product } = result;
            expect(createdAt).not.toBeUndefined();
            expect(updatedAt).not.toBeUndefined();
            expect(product.id).toEqual(chainProduct_01.id);
            expect(product.description?.en).toEqual(input.description?.en);
            expect(product).toMatchSnapshot(
              'description SHOULD BE UPDATED_DESCRIPTION',
            );

            // Regeneration check
            expect(regenMockHandler).toBeCalledTimes(3);
            const allTheCallArguments = regenMockHandler.mock.calls.map(
              call => call[0],
            );
            expect(allTheCallArguments).toHaveLength(3);
            expect(allTheCallArguments).toContain(
              unitProduct_u01_gp01_01.unitId,
            );
            expect(allTheCallArguments).toContain(
              unitProduct_u01_gp02_02.unitId,
            );
            expect(allTheCallArguments).toContain(
              unitProduct_u02_gp01_03.unitId,
            );
            done();
          },
        });
    }, 25000);

    it('should NOT fail in case there is no extended UnitProduct for the given ChainProduct', done => {
      const regenMockHandler = jest.fn().mockReturnValue(of(true));
      const input: AnyuppApi.UpdateChainProductInput = {
        id: chainProduct_02_WITH_NO_CHILD.id,
      };

      iif(
        () => DEBUG_MODE_TEST_WITH_LOCALE_CODE,
        defer(() =>
          productRequestHandler({
            crudSdk: iamCrudSdk,
            regenerateUnitDataHandler: regenMockHandler,
          }).updateChainProduct({
            input,
          }),
        ),
        authAnyuppSdk.UpdateChainProduct({ input }),
      ).subscribe({
        next(product) {
          expect(product).not.toBeUndefined();
          expect(product.id).toEqual(chainProduct_02_WITH_NO_CHILD.id);

          expect(regenMockHandler).not.toBeCalled();
          done();
        },
        error(err) {
          console.error(`${TEST_NAME}Test ERROR`, err);
        },
      });
    }, 25000);
  });
});
