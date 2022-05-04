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

  it('deleteChainProduct$ should called on truly accept dialog', () => {
    const acceptSpy = jest
      .spyOn(service as any, '_acceptDeletion$')
      .mockImplementationOnce(() => of(true));
    const updateSpy = jest
      .spyOn(crudSdk.sdk, 'UpdateChainProduct')
      .mockImplementationOnce(() => ({} as any));
    const productId = 'test_id';

    (<any>service).deleteChainProduct(productId);

    expect(acceptSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalledWith({
      input: { id: 'test_id', deletedAt: expect.any(String) },
    });
  });

  it('deleteChainProduct$ should not called on falsy accept dialog', () => {
    const acceptSpy = jest
      .spyOn(service as any, '_acceptDeletion$')
      .mockImplementationOnce(() => of(false));
    const updateSpy = jest
      .spyOn(crudSdk.sdk, 'UpdateChainProduct')
      .mockImplementationOnce(() => ({} as any));
    const productId = 'test_id';

    (<any>service).deleteChainProduct(productId);

    expect(acceptSpy).toHaveBeenCalled();
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it('deleteGroupProduct$ should called on truly accept dialog', () => {
    const acceptSpy = jest
      .spyOn(service as any, '_acceptDeletion$')
      .mockImplementationOnce(() => of(true));
    const updateSpy = jest
      .spyOn(crudSdk.sdk, 'UpdateGroupProduct')
      .mockImplementationOnce(() => ({} as any));
    const productId = 'test_id';

    (<any>service).deleteGroupProduct(productId);

    expect(acceptSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalledWith({
      input: { id: 'test_id', deletedAt: expect.any(String) },
    });
  });

  it('deleteGroupProduct$ should not called on falsy accept dialog', () => {
    const acceptSpy = jest
      .spyOn(service as any, '_acceptDeletion$')
      .mockImplementationOnce(() => of(false));
    const updateSpy = jest
      .spyOn(crudSdk.sdk, 'UpdateGroupProduct')
      .mockImplementationOnce(() => ({} as any));
    const productId = 'test_id';

    (<any>service).deleteGroupProduct(productId);

    expect(acceptSpy).toHaveBeenCalled();
    expect(updateSpy).not.toHaveBeenCalled();
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
