import { combineLatest, EMPTY, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ModifiersAndExtrasFormService } from '@bgap/admin/pages/modifiers-and-extras';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  productComponentSetFixture,
  testIdPrefix,
} from '@bgap/shared/fixtures';
import { UpsertResponse } from '@bgap/shared/types';
import { StoreModule } from '@ngrx/store';

import { signInToCognito, signOutFromCognito } from '../../shared/helper';

describe('ModifiersAndExtrasFormService', () => {
  const productComponentId = `${testIdPrefix}ADMIN_PRODUCT_COMPONENT_IT_COMP_01`;
  const productComponentSetId = `${testIdPrefix}ADMIN_PRODUCT_COMPONENT_SET_IT_COMP_SET_01`;

  let service: ModifiersAndExtrasFormService;
  let crudSdk: CrudSdkService;

  const cleanup = () =>
    combineLatest([
      crudSdk.sdk.DeleteProductComponent({
        input: { id: productComponentId },
      }),
      crudSdk.sdk.DeleteProductComponentSet({
        input: { id: productComponentSetId },
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

    service = TestBed.inject(ModifiersAndExtrasFormService);
    crudSdk = TestBed.inject(CrudSdkService);
  });

  it('createProductComponentFormGroup should create form group', () => {
    expect(service.createProductComponentFormGroup().value).toMatchSnapshot();
  });

  it('addComponentToList/removeComponentFromList should handle component to item list', () => {
    const dialogForm = service.createProductComponentSetFormGroup();
    const componentForm = new FormGroup({
      productComponentId: new FormControl(''),
    });

    componentForm.patchValue({ productComponentId: 'productComponentId_01' });
    service.addComponentToList(dialogForm, componentForm);

    componentForm.patchValue({ productComponentId: 'productComponentId_02' });
    service.addComponentToList(dialogForm, componentForm);

    expect(dialogForm.value.items).toMatchInlineSnapshot(`
      Array [
        "productComponentId_01",
        "productComponentId_02",
      ]
    `);

    service.removeComponentFromList(dialogForm, 'productComponentId_01');

    expect(dialogForm.value.items).toMatchInlineSnapshot(`
      Array [
        "productComponentId_02",
      ]
    `);
  });

  it('saveComponentForm$ should call createProductComponent$ method when id is not specified', done => {
    const createSpy = jest
      .spyOn(service, 'createProductComponent$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'insert' }));

    service
      .saveComponentForm$(productComponentSetFixture.productComponentBase)
      .subscribe();

    expect(createSpy).toHaveBeenCalledWith(
      productComponentSetFixture.productComponentBase,
    );

    done();
  });

  it('saveComponentForm$ should call updateProductComponent$ method when id is specified', done => {
    const updateSpy = jest
      .spyOn(service, 'updateProductComponent$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'update' }));

    service
      .saveComponentForm$(
        productComponentSetFixture.productComponentBase,
        productComponentId,
      )
      .subscribe();

    expect(updateSpy).toHaveBeenCalledWith({
      ...productComponentSetFixture.productComponentBase,
      id: productComponentId,
    });

    done();
  });

  it('saveComponentForm$ should call updateProductComponent$ method with avoided dirty flag', done => {
    const updateSpy = jest
      .spyOn(service, 'updateProductComponent$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'update' }));

    service
      .saveComponentForm$(
        productComponentSetFixture.productComponentBase,
        productComponentId,
      )
      .subscribe();

    expect(updateSpy).toHaveBeenCalledWith({
      ...productComponentSetFixture.productComponentBase,
      id: productComponentId,
    });

    done();
  });

  it('createProductComponent$ should create product component', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createProductComponent$({
            ...productComponentSetFixture.productComponentBase,
            id: productComponentId,
            chainId: 'chainId',
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

  it('updateProductComponent$ should update product component', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createProductComponent$({
            ...productComponentSetFixture.productComponentBase,
            id: productComponentId,
            chainId: 'chainId',
          }),
        ),
        catchError(() => cleanup()),
        switchMap(saveResponse =>
          (<UpsertResponse<CrudApi.ProductComponent>>saveResponse).data.id
            ? service.updateProductComponent$({
                ...productComponentSetFixture.productComponentBase,
                id: productComponentId,
                chainId: 'chainId MOD',
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

  it('saveComponentSetForm$ should call createProductComponentSet$ method when id is not specified', done => {
    const createSpy = jest
      .spyOn(service, 'createProductComponentSet$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'insert' }));

    service
      .saveComponentSetForm$(productComponentSetFixture.productComponentSetBase)
      .subscribe();

    expect(createSpy).toHaveBeenCalledWith(
      productComponentSetFixture.productComponentSetBase,
    );

    done();
  });

  it('saveComponentSetForm$ should call updateProductComponentSet$ method when id is specified', done => {
    const updateSpy = jest
      .spyOn(service, 'updateProductComponentSet$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'update' }));

    service
      .saveComponentSetForm$(
        productComponentSetFixture.productComponentSetBase,
        productComponentSetId,
      )
      .subscribe();

    expect(updateSpy).toHaveBeenCalledWith({
      ...productComponentSetFixture.productComponentSetBase,
      id: productComponentSetId,
    });

    done();
  });

  it('saveComponentSetForm$ should call updateProductComponentSet$ method with avoided dirty flag', done => {
    const updateSpy = jest
      .spyOn(service, 'updateProductComponentSet$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'update' }));

    service
      .saveComponentSetForm$(
        productComponentSetFixture.productComponentSetBase,
        productComponentSetId,
      )
      .subscribe();

    expect(updateSpy).toHaveBeenCalledWith({
      ...productComponentSetFixture.productComponentSetBase,
      id: productComponentSetId,
    });

    done();
  });

  it('createProductComponentSet$ should create product component set', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createProductComponentSet$({
            ...productComponentSetFixture.productComponentSetBase,
            id: productComponentSetId,
            chainId: 'chainId',
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

  it('updateProductComponentSet$ should update product component set', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createProductComponentSet$({
            ...productComponentSetFixture.productComponentSetBase,
            id: productComponentSetId,
            chainId: 'chainId',
          }),
        ),
        catchError(() => cleanup()),
        switchMap(saveResponse =>
          (<UpsertResponse<CrudApi.ProductComponentSet>>saveResponse).data.id
            ? service.updateProductComponentSet$({
                ...productComponentSetFixture.productComponentSetBase,
                id: productComponentSetId,
                chainId: 'chainId MOD',
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
