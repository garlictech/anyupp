import { of } from 'rxjs';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductListService } from '@bgap/admin/pages/products';
import { entityConfig } from '@bgap/admin/shared/data-access/ngrx-data';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import { AdminSharedLoggedUserModule } from '@bgap/admin/store/logged-user';
import { NbDialogService } from '@nebular/theme';
import {
  EntityCollectionServiceElementsFactory,
  EntityDataModule,
  EntityDispatcherFactory,
} from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

const acceptedDeletionLogic = (
  service: ProductListService,
  crudSdk: CrudSdkService,
  serviceFuncName: string,
  deleteFuncName: string,
  accept: boolean,
) => {
  const acceptSpy = jest
    .spyOn(service as any, '_acceptDeletion$')
    .mockImplementationOnce(() => of(accept));
  const deleteSpy = jest
    .spyOn(crudSdk.sdk, <keyof typeof crudSdk.sdk>deleteFuncName)
    .mockImplementationOnce(() => ({} as any));
  const productId = 'test_id';

  (<any>service)[serviceFuncName](productId);

  expect(acceptSpy).toHaveBeenCalled();
  if (accept) {
    expect(deleteSpy).toHaveBeenCalledWith({ input: { id: 'test_id' } });
  } else {
    expect(deleteSpy).not.toHaveBeenCalled();
  }
};

describe('ProductListService', () => {
  let service: ProductListService;
  let crudSdk: CrudSdkService;

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
        ProductListService,
        NbDialogService,
        EntityCollectionServiceElementsFactory,
        EntityDispatcherFactory,
        {
          provide: NbDialogService,
          useValue: {
            open: jest.fn(),
          },
        },
      ],
    });

    service = TestBed.inject(ProductListService);
    crudSdk = TestBed.inject(CrudSdkService);
  });

  it('deleteChainProduct$ should not called on falsy accept dialog', () => {
    acceptedDeletionLogic(
      service,
      crudSdk,
      'deleteChainProduct',
      'DeleteChainProduct',
      false,
    );
  });

  it('deleteChainProduct$ should called on truly accept dialog', () => {
    acceptedDeletionLogic(
      service,
      crudSdk,
      'deleteChainProduct',
      'DeleteChainProduct',
      true,
    );
  });

  it('deleteGroupProduct$ should not called on falsy accept dialog', () => {
    acceptedDeletionLogic(
      service,
      crudSdk,
      'deleteGroupProduct',
      'DeleteGroupProduct',
      false,
    );
  });

  it('deleteGroupProduct$ should called on truly accept dialog', () => {
    acceptedDeletionLogic(
      service,
      crudSdk,
      'deleteGroupProduct',
      'DeleteGroupProduct',
      true,
    );
  });

  it('deleteUnitProduct$ should called on truly accept dialog', () => {
    const acceptSpy = jest
      .spyOn(service as any, '_acceptDeletion$')
      .mockImplementationOnce(() => of(true));
    const updateSpy = jest
      .spyOn(crudSdk.sdk, 'UpdateUnitProduct')
      .mockImplementationOnce(() => ({} as any));
    const productId = 'test_id';

    (<any>service).deleteUnitProduct(productId);

    expect(acceptSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalledWith({
      input: { id: 'test_id', deletedAt: expect.any(String) },
    });
  });

  it('deleteUnitProduct$ should not called on falsy accept dialog', () => {
    const acceptSpy = jest
      .spyOn(service as any, '_acceptDeletion$')
      .mockImplementationOnce(() => of(false));
    const updateSpy = jest
      .spyOn(crudSdk.sdk, 'UpdateUnitProduct')
      .mockImplementationOnce(() => ({} as any));
    const productId = 'test_id';

    (<any>service).deleteUnitProduct(productId);

    expect(acceptSpy).toHaveBeenCalled();
    expect(updateSpy).not.toHaveBeenCalled();
  });
});
