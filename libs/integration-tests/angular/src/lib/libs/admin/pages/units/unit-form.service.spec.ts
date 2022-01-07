import { EMPTY, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UnitFormService } from '@bgap/admin/pages/units';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import * as CrudApi from '@bgap/crud-gql/api';
import { testIdPrefix, unitFixture } from '@bgap/shared/fixtures';
import { UpsertResponse } from '@bgap/shared/types';
import { StoreModule } from '@ngrx/store';

import { signInToCognito, signOutFromCognito } from '../../shared/helper';

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
  });

  afterAll(async () => {
    await signOutFromCognito();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, StoreModule.forRoot({})],
    });

    service = TestBed.inject(UnitFormService);
    crudSdk = TestBed.inject(CrudSdkService);
  });

  it('createUnitFormGroup should create form group', () => {
    expect(service.createUnitFormGroup().value).toMatchSnapshot();
  });

  it('saveForm$ should call createUnit$ method when id is not specified', done => {
    const createSpy = jest
      .spyOn(service, 'createUnit$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'insert' }));

    service.saveForm$(unitFixture.unitInputBase).subscribe();

    expect(createSpy).toHaveBeenCalledWith({
      ...unitFixture.unitInputBase,
      isAcceptingOrders: false,
    });

    done();
  });

  it('saveForm$ should call updateUnit method when id is specified', done => {
    const updateSpy = jest
      .spyOn(service, 'updateUnit$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'update' }));

    service.saveForm$(unitFixture.unitInputBase, unitId).subscribe();

    expect(updateSpy).toHaveBeenCalledWith({
      ...unitFixture.unitInputBase,
      id: unitId,
    });

    done();
  });

  it('createUnit$ should create unit', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createUnit$({
            ...unitFixture.unitInputBase,
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
  }, 25000);

  it('updateUnit$ should update unit', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createUnit$({
            ...unitFixture.unitInputBase,
            id: unitId,
          }),
        ),
        catchError(() => cleanup()),
        switchMap(saveResponse =>
          (<UpsertResponse<CrudApi.ChainProduct>>saveResponse).data.id
            ? service.updateUnit$({
                ...unitFixture.unitInputBase,
                id: unitId,
                name: `${unitFixture.unitInputBase} MOD`,
                supportedOrderModes: [CrudApi.OrderMode.pickup],
                supportedServingModes: [CrudApi.ServingMode.takeaway],
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
