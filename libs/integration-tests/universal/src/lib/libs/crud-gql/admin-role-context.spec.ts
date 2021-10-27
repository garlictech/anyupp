import { of } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';

import * as CrudApi from '@bgap/crud-gql/api';
import { testIdPrefix } from '@bgap/shared/fixtures';
import { RequiredId } from '@bgap/shared/types';

const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';

const DYNAMODB_OPERATION_DELAY = 3000;
const TEST_NAME = 'CREATE_ADMIN_ROLE_CONTEXT';

const adminUserInput: RequiredId<CrudApi.CreateAdminUserInput> = {
  id: 'int-test-user-name',
  email: 'foobar@anyupp.com',
  name: 'int-test-user-name',
  phone: '+8234567892',
};
const suRoleContextInput: RequiredId<CrudApi.CreateRoleContextInput> = {
  id: `${testIdPrefix}${TEST_NAME}_role_context_01`,
  name: { hu: 'superuser' },
  contextId: 'SOME_CTX_ID',
  role: CrudApi.Role.superuser,
};
const caRoleContextInput: RequiredId<CrudApi.CreateRoleContextInput> = {
  id: `${testIdPrefix}${TEST_NAME}_role_context_02`,
  name: { hu: 'chainadmin' },
  contextId: 'OTHER_CTX_ID',
  role: CrudApi.Role.chainadmin,
};
const adminUserSuRoleInput: RequiredId<CrudApi.CreateAdminRoleContextInput> = {
  id: `${testIdPrefix}${TEST_NAME}_admin_role_01`,
  roleContextId: suRoleContextInput.id,
  adminUserId: adminUserInput.id,
};
const adminUserCaRoleInput: RequiredId<CrudApi.CreateAdminRoleContextInput> = {
  id: `${testIdPrefix}${TEST_NAME}_admin_role_02`,
  roleContextId: caRoleContextInput.id,
  adminUserId: adminUserInput.id,
};

describe('adminRoleContext test', () => {
  const crudSdk = CrudApi.getCrudSdkForIAM(accessKeyId, secretAccessKey);

  const cleanup = () =>
    of('cleanup').pipe(
      switchMap(() =>
        crudSdk.DeleteAdminRoleContext({
          input: { id: adminUserSuRoleInput.id },
        }),
      ),
      switchMap(() =>
        crudSdk.DeleteAdminRoleContext({
          input: { id: adminUserCaRoleInput.id },
        }),
      ),
      switchMap(() =>
        crudSdk.DeleteAdminUser({ input: { id: adminUserInput.name } }),
      ),
      switchMap(() =>
        crudSdk.DeleteRoleContext({
          input: { id: suRoleContextInput.id },
        }),
      ),
      switchMap(() =>
        crudSdk.DeleteRoleContext({
          input: { id: caRoleContextInput.id },
        }),
      ),
    );

  beforeEach(async () => {
    await cleanup()
      .pipe(
        // Seeding
        switchMap(() =>
          crudSdk.CreateAdminUser({
            input: adminUserInput,
          }),
        ),
        delay(DYNAMODB_OPERATION_DELAY),
        switchMap(() =>
          crudSdk.CreateRoleContext({
            input: suRoleContextInput,
          }),
        ),
        delay(DYNAMODB_OPERATION_DELAY),
        switchMap(() =>
          crudSdk.CreateRoleContext({
            input: caRoleContextInput,
          }),
        ),
        delay(DYNAMODB_OPERATION_DELAY),
        switchMap(() =>
          crudSdk.CreateAdminRoleContext({
            input: adminUserSuRoleInput,
          }),
        ),
        delay(DYNAMODB_OPERATION_DELAY),
      )
      .toPromise();
  }, 25000);

  afterAll(() => cleanup().toPromise(), 15000);

  const startStateCheck = () =>
    of('CREATE_TEST_USER_WITH_TEST_ROLE_CONTEXT').pipe(
      switchMap(() => crudSdk.GetAdminUser({ id: adminUserInput.id })),
      tap({
        next(result) {
          expect(result?.roleContexts?.items?.length).toBe(1);
        },
      }),
      delay(DYNAMODB_OPERATION_DELAY),
    );

  it('should list new admin role context after assign it', done => {
    startStateCheck()
      .pipe(
        switchMap(() =>
          crudSdk.CreateAdminRoleContext({
            input: adminUserCaRoleInput,
          }),
        ),
        delay(DYNAMODB_OPERATION_DELAY),
        switchMap(() =>
          crudSdk.GetAdminUser(
            { id: adminUserInput.id },
            { fetchPolicy: 'no-cache' },
          ),
        ),
        tap({
          next(result) {
            expect(result?.roleContexts?.items?.length).toBe(2);
          },
        }),
      )
      .subscribe({
        next() {
          // SHOULD NOT TIMEOUT so this next callback should be triggered
          done();
        },
        error(err) {
          console.error(`${TEST_NAME}Test ERROR`, err);
        },
      });
  }, 25000);
});
