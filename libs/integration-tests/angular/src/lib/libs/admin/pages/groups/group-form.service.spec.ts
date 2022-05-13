import { EMPTY, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { GroupFormService } from '@bgap/admin/pages/groups';
import { entityConfig } from '@bgap/admin/shared/data-access/ngrx-data';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import { AdminSharedLoggedUserModule } from '@bgap/admin/store/logged-user';
import * as CrudApi from '@bgap/crud-gql/api';
import { groupFixture, testIdPrefix } from '@bgap/shared/fixtures';
import { UpsertResponse } from '@bgap/shared/types';
import {
  EntityCollectionServiceElementsFactory,
  EntityDataModule,
  EntityDispatcherFactory,
} from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { signInToCognito, signOutFromCognito } from '../../shared/helper';

describe('GroupFormService', () => {
  const groupId = `${testIdPrefix}ADMIN_GROUP_IT_GROUP_ID_01`;

  let service: GroupFormService;
  let crudSdk: CrudSdkService;

  const cleanup = () =>
    crudSdk.sdk.DeleteGroup({
      input: { id: groupId },
    });

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
        AdminSharedLoggedUserModule,
      ],
      providers: [
        EntityCollectionServiceElementsFactory,
        EntityDispatcherFactory,
      ],
    });

    service = TestBed.inject(GroupFormService);
    crudSdk = TestBed.inject(CrudSdkService);
  }, 60000);

  it('createGroupFormGroup should create form group', () => {
    expect(service.createGroupFormGroup().value).toMatchSnapshot();
  });

  it('saveForm$ should call createGroup$ method when id is not specified', done => {
    const createSpy = jest
      .spyOn(service, 'createGroup$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'insert' }));

    service.saveForm$(groupFixture.group_01).subscribe();

    expect(createSpy).toHaveBeenCalledWith(groupFixture.group_01);

    done();
  }, 60000);

  it('saveForm$ should call updateGroup$ method when id is specified', done => {
    const updateSpy = jest
      .spyOn(service, 'updateGroup$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'update' }));

    service.saveForm$(groupFixture.group_01, groupId).subscribe();

    expect(updateSpy).toHaveBeenCalledWith({
      ...groupFixture.group_01,
      id: groupId,
    });

    done();
  }, 60000);

  it('createGroup$ should create group', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createGroup$({
            ...groupFixture.group_01,
            id: groupId,
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

  it('updateGroup$ should update group', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createGroup$({
            ...groupFixture.group_01,
            id: groupId,
          }),
        ),
        catchError(() => cleanup()),
        switchMap(saveResponse =>
          (<UpsertResponse<CrudApi.Group>>saveResponse).data.id
            ? service.updateGroup$({
                ...groupFixture.group_01,
                id: groupId,
                name: 'MODIFIED NAME',
                phone: 'MODIFIED PHONE',
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
