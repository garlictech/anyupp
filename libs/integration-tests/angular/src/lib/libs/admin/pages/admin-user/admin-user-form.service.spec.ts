import { combineLatest, EMPTY, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminUserFormService } from '@bgap/admin/pages/admin-users';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  adminUserFixture,
  roleContextFixture,
  testIdPrefix,
} from '@bgap/shared/fixtures';
import { UpsertResponse } from '@bgap/shared/types';
import { StoreModule } from '@ngrx/store';

import { signInToCognito, signOutFromCognito } from '../../shared/helper';
import { RoleContextsFormService } from '@bgap/admin/pages/role-contexts';

describe('AdminUserFormService', () => {
  const adminUserId1 = `${testIdPrefix}ADMIN_ADMIN_USER_IT_ADMIN_USER_ID_01`;
  const adminUserId2 = `${testIdPrefix}ADMIN_ADMIN_USER_IT_ADMIN_USER_ID_02`;
  const adminUserId3 = `${testIdPrefix}ADMIN_ADMIN_USER_IT_ADMIN_USER_ID_03`;
  const adminRoleContextId = `${testIdPrefix}ADMIN_ADMIN_ROLE_CONTEXT_IT_ADMIN_RC_ID_01`;
  const roleContextId = `${testIdPrefix}ADMIN_ROLE_CONTEXT_IT_ROLE_CONTEXT_ID_01`;

  let service: AdminUserFormService;
  let roleContextService: RoleContextsFormService;
  let crudSdk: CrudSdkService;

  const cleanup = () =>
    combineLatest([
      crudSdk.sdk.DeleteAdminUser({
        input: { id: adminUserId1 },
      }),
      crudSdk.sdk.DeleteAdminUser({
        input: { id: adminUserId2 },
      }),
      crudSdk.sdk.DeleteAdminUser({
        input: { id: adminUserId3 },
      }),
      crudSdk.sdk.DeleteRoleContext({
        input: { id: roleContextId },
      }),
    ]);

  beforeAll(async () => {
    await signInToCognito();
  });

  afterAll(async () => {
    await signOutFromCognito();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, StoreModule.forRoot({})],
    });

    service = TestBed.inject(AdminUserFormService);
    roleContextService = TestBed.inject(RoleContextsFormService);
    crudSdk = TestBed.inject(CrudSdkService);
  });

  it('createAdminUserFormGroup should create form group', () => {
    expect(service.createAdminUserFormGroup().value).toMatchSnapshot();
  });

  it('saveForm$ should call createAdminUser$ method when id is not specified', done => {
    const createSpy = jest
      .spyOn(service, 'createAdminUser$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'insert' }));

    service.saveForm$(adminUserFixture.adminUserBase).subscribe();

    expect(createSpy).toHaveBeenCalledWith(adminUserFixture.adminUserBase);

    done();
  });

  it('saveForm$ should call updateAdminUser$ method when id is not specified', done => {
    const updateSpy = jest
      .spyOn(service, 'updateAdminUser$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'update' }));

    service.saveForm$(adminUserFixture.adminUserBase, adminUserId1).subscribe();

    expect(updateSpy).toHaveBeenCalledWith({
      ...adminUserFixture.adminUserBase,
      id: adminUserId1,
    });

    done();
  });

  it('createAdminUser$ should create admin user', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createAdminUser$({
            ...adminUserFixture.adminUserBase,
            id: adminUserId1,
          }),
        ),
        tap(saveResponse => {
          expect(saveResponse).toMatchSnapshot({
            data: {
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          });
        }),
        switchMap(() => cleanup()),
      )
      .subscribe(() => {
        done();
      });
  }, 25000);

  it('updateAdminUser$ should update admin user', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createAdminUser$({
            ...adminUserFixture.adminUserBase,
            id: adminUserId2,
          }),
        ),
        catchError(() => cleanup()),
        switchMap(saveResponse =>
          (<UpsertResponse<CrudApi.ProductCategory>>saveResponse).data.id
            ? service.updateAdminUser$({
                ...adminUserFixture.adminUserBase,
                id: adminUserId2,
                name: 'Micky Mouse',
                email: 'testuser+mickey@anyupp.com',
              })
            : EMPTY,
        ),
        catchError(() => cleanup()),
        tap(updateResponse => {
          expect(updateResponse).toMatchSnapshot({
            data: {
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          });
        }),
        switchMap(() => cleanup()),
      )
      .subscribe(() => {
        done();
      });
  }, 25000);

  it('createAdminRoleContext$ and deleteAdminRoleContext$ should handle admin role context', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createAdminUser$({
            ...adminUserFixture.adminUserBase,
            id: adminUserId3,
          }),
        ),
        switchMap(() =>
          roleContextService.createRoleContext$({
            ...roleContextFixture.roleContextInputBase,
            id: roleContextId,
          }),
        ),
        switchMap(() =>
          service.createAdminRoleContext$({
            id: adminRoleContextId,
            adminUserId: adminUserId3,
            roleContextId,
          }),
        ),
        tap(saveResponse => {
          expect(saveResponse).toMatchSnapshot({
            data: {
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              roleContext: {
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              },
            },
          });
        }),
        switchMap(() => service.deleteAdminRoleContext$(adminRoleContextId)),
        tap(deleteResponse => {
          expect(deleteResponse).toMatchSnapshot({
            data: {
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              roleContext: {
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              },
            },
          });
        }),
        switchMap(() => cleanup()),
      )
      .subscribe(() => {
        done();
      });
  }, 25000);
});
