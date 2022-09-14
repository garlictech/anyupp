import { EMPTY, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CrudSdkService,
  entityConfig,
  UnitFormService,
} from '@bgap/admin/refactor';

import { testIdPrefix, unitFixture } from '@bgap/shared/fixtures';
import { UpsertResponse } from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import {
  EntityCollectionServiceElementsFactory,
  EntityDataModule,
  EntityDispatcherFactory,
} from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { signInToCognito, signOutFromCognito } from '../../shared/helper';
import {
  MockNbDialogService,
  MockTranslateService,
} from '../../shared/service-mocks';
import { OrderMode, ServingMode, Unit, UnitProduct } from '@bgap/domain';

describe('UnitFormService', () => {
  const unitId = `${testIdPrefix}ADMIN_UNIT_IT_UNIT_ID_01`;
  let service: UnitFormService;
  let crudSdk: CrudSdkService;

  const cleanup = () =>
    crudSdk.sdk.DeleteUnit({
      input: { id: unitId },
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
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        EntityDataModule.forRoot(entityConfig),
        HttpClientModule,
        //   AdminSharedLoggedUserModule,
      ],
      providers: [
        EntityCollectionServiceElementsFactory,
        EntityDispatcherFactory,
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: NbDialogService, useClass: MockNbDialogService },
      ],
    });

    service = TestBed.inject(UnitFormService);
    crudSdk = TestBed.inject(CrudSdkService);
  }, 60000);

  it('createUnitFormGroup should create new form group', () => {
    expect(service.createUnitFormGroup().value).toMatchSnapshot();
  });

  it('createUnitFormGroup should create update form group', () => {
    expect(service.createUnitFormGroup().value).toMatchSnapshot();
  });

  it('saveForm$ should call createUnit$ method when id is not specified', done => {
    const createSpy = jest
      .spyOn(service, 'createUnit$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'insert' }));

    service.saveForm$(unitFixture.unitBase, false).subscribe();

    expect(createSpy).toHaveBeenCalledWith({
      ...unitFixture.unitBase,
      isAcceptingOrders: false,
    });

    done();
  }, 60000);

  it('saveForm$ should call updateUnit method when id is specified', done => {
    const updateSpy = jest
      .spyOn(service, 'updateUnit$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'update' }));

    service.saveForm$(unitFixture.unitBase, false, unitId).subscribe();

    expect(updateSpy).toHaveBeenCalledWith(
      {
        ...unitFixture.unitBase,
        id: unitId,
      },
      false,
    );

    done();
  }, 60000);

  it('createUnit$ should create unit', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createUnit$({
            ...unitFixture.unitBase,
            id: unitId,
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

  it('updateUnit$ should update unit', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createUnit$({
            ...unitFixture.unitBase,
            id: unitId,
          }),
        ),
        catchError(() => cleanup()),
        switchMap(saveResponse =>
          (<UpsertResponse<UnitProduct>>saveResponse).data.id
            ? service.updateUnit$(
                {
                  ...unitFixture.unitBase,
                  id: unitId,
                  name: `${unitFixture.unitBase} MOD`,
                  supportedOrderModes: [OrderMode.pickup],
                  supportedServingModes: [ServingMode.takeaway],
                },
                false,
              )
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

  it('updateRKeeperData$ should update the RKeepeR POS content', done => {
    let hashedPassword = '';

    cleanup()
      .pipe(
        switchMap(() =>
          service.createUnit$({
            ...unitFixture.createRkeeperUnit,
            id: unitId,
          }),
        ),
        tap(saveResponse => {
          hashedPassword =
            (<UpsertResponse<Unit>>saveResponse).data?.pos?.rkeeper
              ?.anyuppPassword || '';
        }),
        catchError(() => cleanup()),
        switchMap(saveResponse =>
          (<UpsertResponse<Unit>>saveResponse).data.id
            ? service.updateRKeeperData$({
                unitId,
                rkeeperPassword: 'test-rkeeperPassword',
                rkeeperUsername: 'test-rkeeperUsername',
                endpointUri: 'test-endpointUri',
                anyuppUsername: 'test-anyuppUsername',
              })
            : EMPTY,
        ),
        catchError(() => cleanup()),
        tap(updateResponse => {
          expect(updateResponse).toMatchSnapshot({
            data: {
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              pos: {
                rkeeper: {
                  anyuppPassword: expect.any(String),
                },
              },
            },
          });

          // anyuppPassword unmodified
          expect(
            (<UpsertResponse<Unit>>updateResponse).data?.pos?.rkeeper
              ?.anyuppPassword,
          ).toEqual(hashedPassword);
        }),
        switchMap(() => cleanup()),
      )
      .subscribe(() => {
        done();
      });
  }, 60000);

  it('updateRKeeperData$ should update the RKeepeR AnyUPP password', done => {
    let hashedPassword = '';

    cleanup()
      .pipe(
        switchMap(() =>
          service.createUnit$({
            ...unitFixture.createRkeeperUnit,
            id: unitId,
          }),
        ),
        tap(saveResponse => {
          hashedPassword =
            (<UpsertResponse<Unit>>saveResponse).data?.pos?.rkeeper
              ?.anyuppPassword || '';
        }),
        catchError(() => cleanup()),
        switchMap(saveResponse =>
          (<UpsertResponse<UnitProduct>>saveResponse).data.id
            ? service.updateRKeeperData$({
                unitId,
                anyuppPassword: 'new-anyuppPassword',
              })
            : EMPTY,
        ),
        catchError(() => cleanup()),
        tap(updateResponse => {
          expect(updateResponse).toMatchSnapshot({
            data: {
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              pos: {
                rkeeper: {
                  anyuppPassword: expect.any(String),
                },
              },
            },
          });

          // anyuppPassword changed
          expect(
            (<UpsertResponse<Unit>>updateResponse).data?.pos?.rkeeper
              ?.anyuppPassword,
          ).not.toEqual(hashedPassword);
        }),
        switchMap(() => cleanup()),
      )
      .subscribe(() => {
        done();
      });
  }, 60000);
});
