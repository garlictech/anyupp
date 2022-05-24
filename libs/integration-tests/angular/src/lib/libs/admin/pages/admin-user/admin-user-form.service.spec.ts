import { combineLatest, EMPTY, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  AdminUserFormService,
  CrudSdkService,
  entityConfig,
} from '@bgap/admin/refactor';
import * as CrudApi from '@bgap/crud-gql/api';
import { adminUserFixture, testIdPrefix } from '@bgap/shared/fixtures';
import { UpsertResponse } from '@bgap/shared/types';
import {
  EntityCollectionServiceElementsFactory,
  EntityDataModule,
  EntityDispatcherFactory,
} from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { signInToCognito, signOutFromCognito } from '../../shared/helper';

describe('AdminUserFormService', () => {
  const adminUserId1 = `${testIdPrefix}ADMIN_ADMIN_USER_IT_ADMIN_USER_ID_01`;
  const adminUserId2 = `${testIdPrefix}ADMIN_ADMIN_USER_IT_ADMIN_USER_ID_02`;
  const adminUserId3 = `${testIdPrefix}ADMIN_ADMIN_USER_IT_ADMIN_USER_ID_03`;

  let service: AdminUserFormService;
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
    ]);

  beforeAll(async () => {
    await signInToCognito();
  }, 60000);

  afterAll(async () => {
    await signOutFromCognito();
  }, 60000);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        EntityDataModule.forRoot(entityConfig),
        HttpClientModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        EntityCollectionServiceElementsFactory,
        EntityDispatcherFactory,
      ],
    });

    service = TestBed.inject(AdminUserFormService);
    crudSdk = TestBed.inject(CrudSdkService);
  }, 60000);

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
  }, 60000);

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
  }, 60000);

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
  }, 60000);

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
  }, 60000);
});
