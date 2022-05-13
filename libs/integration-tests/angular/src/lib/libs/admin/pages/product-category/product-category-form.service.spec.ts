import { EMPTY, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductCategoryFormService } from '@bgap/admin/pages/product-categories';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import * as CrudApi from '@bgap/crud-gql/api';
import { productCategoryFixture, testIdPrefix } from '@bgap/shared/fixtures';
import { UpsertResponse } from '@bgap/shared/types';
import { StoreModule } from '@ngrx/store';

import { signInToCognito, signOutFromCognito } from '../../shared/helper';
import { EffectsModule } from '@ngrx/effects';
import {
  EntityCollectionServiceElementsFactory,
  EntityDataModule,
  EntityDispatcherFactory,
} from '@ngrx/data';
import { entityConfig } from '@bgap/admin/shared/data-access/ngrx-data';
import { HttpClientModule } from '@angular/common/http';
import { AdminSharedLoggedUserModule } from '@bgap/admin/store/logged-user';

describe('ProductCategoryFormService', () => {
  const productCategoryId = `${testIdPrefix}ADMIN_PRODUCT_CATEGORY_IT_PRODUCT_CATEGORY_ID_01`;

  let service: ProductCategoryFormService;
  let crudSdk: CrudSdkService;

  const cleanup = () =>
    crudSdk.sdk.DeleteProductCategory({
      input: { id: productCategoryId },
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

    service = TestBed.inject(ProductCategoryFormService);
    crudSdk = TestBed.inject(CrudSdkService);
  }, 60000);

  it('createGroupFormGroup should create form group', () => {
    expect(service.createProductCategoryFormGroup().value).toMatchSnapshot();
  });

  it('saveForm$ should call createProductCategory$ method when id is not specified', done => {
    const createSpy = jest
      .spyOn(service, 'createProductCategory$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'insert' }));

    service.saveForm$(productCategoryFixture.productCategoryBase).subscribe();

    expect(createSpy).toHaveBeenCalledWith(
      productCategoryFixture.productCategoryBase,
    );

    done();
  }, 60000);

  it('saveForm$ should call updateProductCategory$ method when id is specified', done => {
    const updateSpy = jest
      .spyOn(service, 'updateProductCategory$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'update' }));

    service
      .saveForm$(productCategoryFixture.productCategoryBase, productCategoryId)
      .subscribe();

    expect(updateSpy).toHaveBeenCalledWith({
      ...productCategoryFixture.productCategoryBase,
      id: productCategoryId,
    });

    done();
  }, 60000);

  it('createProductCategory$ should create product category', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createProductCategory$({
            ...productCategoryFixture.productCategoryBase,
            id: productCategoryId,
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

  it('updateProductCategory$ should update product category', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createProductCategory$({
            ...productCategoryFixture.productCategoryBase,
            id: productCategoryId,
          }),
        ),
        catchError(() => cleanup()),
        switchMap(saveResponse =>
          (<UpsertResponse<CrudApi.ProductCategory>>saveResponse).data.id
            ? service.updateProductCategory$({
                ...productCategoryFixture.productCategoryBase,
                id: productCategoryId,
                image: 'MODDED IMAGE',
                position: 33,
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
