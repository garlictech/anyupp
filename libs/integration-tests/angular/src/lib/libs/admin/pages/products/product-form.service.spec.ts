import { combineLatest, EMPTY, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { TestBed } from '@angular/core/testing';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { ProductFormService } from '@bgap/admin/pages/products';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import * as CrudApi from '@bgap/crud-gql/api';
import { productFixture, testIdPrefix } from '@bgap/shared/fixtures';
import { EProductLevel, UpsertResponse } from '@bgap/shared/types';
import { StoreModule } from '@ngrx/store';

import { signInToCognito, signOutFromCognito } from '../../shared/helper';

describe('ProductFormService', () => {
  const chainProductId = `${testIdPrefix}ADMIN_PRODUCT_IT_CHAIN_PRODUCT_ID_01`;
  const groupProductId = `${testIdPrefix}ADMIN_PRODUCT_IT_GROUP_PRODUCT_ID_01`;
  const unitProductId = `${testIdPrefix}ADMIN_PRODUCT_IT_UNIT_PRODUCT_ID_01`;

  let service: ProductFormService;
  let crudSdk: CrudSdkService;

  const cleanup = () =>
    combineLatest([
      crudSdk.sdk.DeleteChainProduct({
        input: { id: chainProductId },
      }),
      crudSdk.sdk.DeleteGroupProduct({
        input: { id: groupProductId },
      }),
      crudSdk.sdk.DeleteUnitProduct({
        input: { id: unitProductId },
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

    service = TestBed.inject(ProductFormService);
    crudSdk = TestBed.inject(CrudSdkService);
  });

  it('createProductFormGroup should create form group', () => {
    expect(service.createProductFormGroup().value).toMatchSnapshot();
  });

  it('createProductExtendFormGroup should create form group', () => {
    expect(
      service.createProductExtendFormGroup(EProductLevel.GROUP).value,
    ).toMatchSnapshot();
  });

  it('createProductExtendFormGroup should create form group', () => {
    expect(
      service.createProductExtendFormGroup(EProductLevel.UNIT).value,
    ).toMatchSnapshot();
  });

  it('patchProductVariants should add variants to form array', () => {
    const variantsArray = new FormArray([]);

    service.patchProductVariants(
      productFixture.chainProductBase.variants,
      variantsArray,
    );

    expect(variantsArray.value).toMatchSnapshot();
  });

  it('patchExtendedProductVariants should add variants to form array', () => {
    const variantsArray = new FormArray([]);

    service.patchExtendedProductVariants(
      productFixture.groupProductBase.variants,
      variantsArray,
    );

    expect(variantsArray.value).toMatchSnapshot();
  });

  it('patchConfigSet should add configsets to form array', () => {
    const configSetsArray = new FormArray([]);

    service.patchConfigSet([], configSetsArray);

    expect(configSetsArray.value).toMatchSnapshot();
  });

  it('saveChainForm$ should call createChainProduct$ method when id is not specified', done => {
    const createSpy = jest
      .spyOn(service, 'createChainProduct$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'insert' }));

    service.saveChainForm$(productFixture.chainProductInputBase).subscribe();

    expect(createSpy).toHaveBeenCalledWith({
      ...productFixture.chainProductInputBase,
    });

    done();
  });

  it('saveChainForm$ should call updateChainProduct$ method when id is specified', done => {
    const updateSpy = jest
      .spyOn(service, 'updateChainProduct$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'update' }));

    service
      .saveChainForm$(
        productFixture.chainProductInputBase,
        chainProductId,
        false,
      )
      .subscribe();

    expect(updateSpy).toHaveBeenCalledWith({
      ...productFixture.chainProductInputBase,
      id: chainProductId,
      dirty: false,
    });

    done();
  });

  it('saveChainForm$ should call updateChainProduct$ method with avoided dirty flag', done => {
    const updateSpy = jest
      .spyOn(service, 'updateChainProduct$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'update' }));

    service
      .saveChainForm$(productFixture.chainProductInputBase, chainProductId)
      .subscribe();

    expect(updateSpy).toHaveBeenCalledWith({
      ...productFixture.chainProductInputBase,
      id: chainProductId,
      dirty: undefined,
    });

    done();
  });

  it('createChainProduct$ should create chain product', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createChainProduct$({
            ...productFixture.chainProductInputBase,
            id: chainProductId,
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

  it('updateChainProduct$ should update chain product', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createChainProduct$({
            ...productFixture.chainProductInputBase,
            id: chainProductId,
          }),
        ),
        catchError(() => cleanup()),
        switchMap(saveResponse =>
          (<UpsertResponse<CrudApi.ChainProduct>>saveResponse).data.id
            ? service.updateChainProduct$({
                ...productFixture.chainProductInputBase,
                id: chainProductId,
                image: 'IMAGE_MOD',
                productType: 'PRODUCT_TYPE_MOD',
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

  it('saveGroupExtendForm$ should call createGroupProduct$ method when editing mode is false', done => {
    const createSpy = jest
      .spyOn(service, 'createGroupProduct$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'insert' }));

    service
      .saveGroupExtendForm$(
        productFixture.groupProductInputBase,
        productFixture.groupProductInputBase,
        false,
      )
      .subscribe();

    expect(createSpy).toHaveBeenCalledWith(
      productFixture.groupProductInputBase,
    );

    done();
  });

  it('saveGroupExtendForm$ should call updateGroupProduct$ method when editing mode is true', done => {
    const updateSpy = jest
      .spyOn(service, 'updateGroupProduct$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'update' }));

    service
      .saveGroupExtendForm$(
        productFixture.groupProductInputBase,
        productFixture.groupProductInputBase,
        true,
      )
      .subscribe();

    expect(updateSpy).toHaveBeenCalledWith(
      productFixture.groupProductInputBase,
    );

    done();
  });

  it('createGroupProduct$ should create group product', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createGroupProduct$({
            ...productFixture.groupProductInputBase,
            id: groupProductId,
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

  it('updateGroupProduct$ should update group product', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createGroupProduct$({
            ...productFixture.groupProductInputBase,
            id: groupProductId,
          }),
        ),
        catchError(() => cleanup()),
        switchMap(saveResponse =>
          (<UpsertResponse<CrudApi.GroupProduct>>saveResponse).data.id
            ? service.updateGroupProduct$({
                ...productFixture.groupProductInputBase,
                id: groupProductId,
                tax: 33,
                takeawayTax: 30,
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

  it('saveUnitExtendForm$ should call createUnitProduct$ method when editing mode is false', done => {
    const createSpy = jest
      .spyOn(service, 'createUnitProduct$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'insert' }));

    service
      .saveUnitExtendForm$(
        productFixture.unitProductInputBase,
        productFixture.unitProductInputBase,
        false,
      )
      .subscribe();

    expect(createSpy).toHaveBeenCalledWith(productFixture.unitProductInputBase);

    done();
  });

  it('saveUnitExtendForm$ should call updateUnitProduct$ method when editing mode is true', done => {
    const updateSpy = jest
      .spyOn(service, 'updateUnitProduct$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'update' }));

    service
      .saveUnitExtendForm$(
        productFixture.unitProductInputBase,
        productFixture.unitProductInputBase,
        true,
      )
      .subscribe();

    expect(updateSpy).toHaveBeenCalledWith(productFixture.unitProductInputBase);

    done();
  });

  it('createUnitProduct$ should create unit product', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createUnitProduct$({
            ...productFixture.unitProductInputBase,
            id: unitProductId,
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

  it('updateUnitProduct$ should update unit product', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createUnitProduct$({
            ...productFixture.unitProductInputBase,
            id: unitProductId,
          }),
        ),
        catchError(() => cleanup()),
        switchMap(saveResponse =>
          (<UpsertResponse<CrudApi.UnitProduct>>saveResponse).data.id
            ? service.updateUnitProduct$({
                ...productFixture.unitProductInputBase,
                id: unitProductId,
                supportedServingModes: [CrudApi.ServingMode.inplace],
                isVisible: false,
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
