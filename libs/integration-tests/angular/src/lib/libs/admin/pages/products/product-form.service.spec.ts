import { combineLatest, EMPTY } from 'rxjs';
import { catchError, switchMap, tap, delay } from 'rxjs/operators';

import { TestBed } from '@angular/core/testing';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { ProductFormService } from '@bgap/admin/refactor';
import { CrudSdkService } from '@bgap/admin/refactor';

import {
  testIdPrefix,
  createProductFixture,
  maskAll,
} from '@bgap/shared/fixtures';
import { UpsertResponse } from '@bgap/shared/types';
import { StoreModule } from '@ngrx/store';

import { signInToCognito, signOutFromCognito } from '../../shared/helper';
import {
  EntityCollectionServiceElementsFactory,
  EntityDataModule,
  EntityDispatcherFactory,
} from '@ngrx/data';
import { entityConfig } from '@bgap/admin/refactor';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { ServingMode, UnitProduct } from '@bgap/domain';

describe('ProductFormService', () => {
  const unitProductId = `${testIdPrefix}ADMIN_PRODUCT_IT_UNIT_PRODUCT_ID_01`;

  let service: ProductFormService;
  let crudSdk: CrudSdkService;

  const productFixure = {
    ...createProductFixture('UNIT_ID', 'PRODUCT CATEGORY ID'),
    id: unitProductId,
  };

  const cleanup = () =>
    combineLatest([
      crudSdk.sdk.DeleteUnitProduct({
        input: { id: unitProductId },
      }),
    ]).pipe(delay(3000));

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
      ],
      providers: [
        EntityCollectionServiceElementsFactory,
        EntityDispatcherFactory,
      ],
    });

    service = TestBed.inject(ProductFormService);
    crudSdk = TestBed.inject(CrudSdkService);
  }, 60000);

  it('createProductFormGroup should create form group', () => {
    expect(service.createProductFormGroup().value).toMatchSnapshot();
  });

  it('patchConfigSet should add configsets to form array', () => {
    const configSetsArray = new FormArray([]);

    service.patchConfigSet([], configSetsArray);

    expect(configSetsArray.value).toMatchSnapshot();
  });

  it('createUnitProduct$ should create unit product', done => {
    cleanup()
      .pipe(
        switchMap(() => service.createUnitProduct$(productFixure)),
        tap(saveResponse => {
          expect(maskAll(saveResponse)).toMatchSnapshot();
        }),
        switchMap(() => cleanup()),
      )
      .subscribe(() => {
        done();
      });
  }, 60000);

  it('updateUnitProduct$ should update unit product', done => {
    cleanup()
      .pipe(
        switchMap(() => service.createUnitProduct$(productFixure)),
        catchError(() => cleanup()),
        switchMap(saveResponse =>
          (<UpsertResponse<UnitProduct>>saveResponse).data.id
            ? service.updateUnitProduct$({
                ...createProductFixture(unitProductId, 'PRODUCT CATEGORY ID'),
                id: unitProductId,
                supportedServingModes: [ServingMode.inplace],
                isVisible: false,
              })
            : EMPTY,
        ),
        catchError(() => cleanup()),
        tap(updateResponse => {
          expect(maskAll(updateResponse)).toMatchSnapshot();
        }),
        switchMap(() => cleanup()),
      )
      .subscribe(() => {
        done();
      });
  }, 60000);
});
