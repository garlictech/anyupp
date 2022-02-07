import { EMPTY, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RoleContextsFormService } from '@bgap/admin/pages/role-contexts';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import * as CrudApi from '@bgap/crud-gql/api';
import { roleContextFixture, testIdPrefix } from '@bgap/shared/fixtures';
import { UpsertResponse } from '@bgap/shared/types';
import { StoreModule } from '@ngrx/store';

import { signInToCognito, signOutFromCognito } from '../../shared/helper';
import { TranslateModule } from '@ngx-translate/core';

describe('RoleContextsFormService', () => {
  const roleContextId = `${testIdPrefix}ADMIN_ROLE_CONTEXT_IT_ROLE_CONTEXT_ID_01`;

  let service: RoleContextsFormService;
  let crudSdk: CrudSdkService;

  const cleanup = () =>
    crudSdk.sdk.DeleteRoleContext({
      input: { id: roleContextId },
    });

  beforeAll(async () => {
    await signInToCognito();
  });

  afterAll(async () => {
    await signOutFromCognito();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        StoreModule.forRoot({}),
        TranslateModule.forRoot(),
      ],
    });

    service = TestBed.inject(RoleContextsFormService);
    crudSdk = TestBed.inject(CrudSdkService);
  });

  it('createRoleContextFormGroup should create form group', () => {
    expect(service.createRoleContextFormGroup().value).toMatchSnapshot();
  });

  it('saveForm$ should call createRoleContext$ method when id is not specified', done => {
    const createSpy = jest
      .spyOn(service, 'createRoleContext$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'insert' }));

    service
      .saveForm$(roleContextFixture.roleContextInputBase, 'CTX_FIXTURE')
      .subscribe();

    expect(createSpy).toHaveBeenCalledWith(
      roleContextFixture.roleContextInputBase,
    );

    done();
  });

  it('saveForm$ should call updateRoleContext$ method when id is specified', done => {
    const updateSpy = jest
      .spyOn(service, 'updateRoleContext$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'update' }));

    service
      .saveForm$(roleContextFixture.roleContextInputBase, '', roleContextId)
      .subscribe();

    expect(updateSpy).toHaveBeenCalledWith({
      ...roleContextFixture.roleContextInputBase,
      id: roleContextId,
    });

    done();
  });

  it('createRoleContext$ should create role context', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createRoleContext$({
            ...roleContextFixture.roleContextInputBase,
            id: roleContextId,
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

  it('updateRoleContext$ should update role context', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createRoleContext$({
            ...roleContextFixture.roleContextInputBase,
            id: roleContextId,
          }),
        ),
        catchError(() => cleanup()),
        switchMap(saveResponse =>
          (<UpsertResponse<CrudApi.ChainProduct>>saveResponse).data.id
            ? service.updateRoleContext$({
                ...roleContextFixture.roleContextInputBase,
                id: roleContextId,
                groupId: 'MOD GROUP ID',
                chainId: 'MOD CHAIN ID',
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
});
