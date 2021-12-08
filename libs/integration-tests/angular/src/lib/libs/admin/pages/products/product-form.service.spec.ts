import { combineLatest, EMPTY } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '@aws-amplify/auth';
import { ProductFormService } from '@bgap/admin/pages/products';
import { productsReducer } from '@bgap/admin/shared/data-access/products';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  getCognitoUsername,
  productFixture,
  testAdminUserPassword,
  testIdPrefix,
} from '@bgap/shared/fixtures';
import { EProductLevel } from '@bgap/shared/types';
import { StoreModule } from '@ngrx/store';

describe('ProductFormService', () => {
  const groupProductId = `${testIdPrefix}ADMIN_PRODUCT_IT_GROUP_PRODUCT_ID_01`;
  const unitProductId = `${testIdPrefix}ADMIN_PRODUCT_IT_UNIT_PRODUCT_ID_01`;

  let service: ProductFormService;
  let crudSdk: CrudSdkService;

  const cleanup = () =>
    combineLatest([
      crudSdk.sdk.DeleteGroupProduct({
        input: { id: groupProductId },
      }),
      crudSdk.sdk.DeleteUnitProduct({
        input: { id: unitProductId },
      }),
    ]);

  beforeAll(async () => {
    Auth.configure({
      ...CrudApi.awsConfig,
      authenticationFlowType: 'USER_PASSWORD_AUTH',
      aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
    });

    await Auth.signIn(getCognitoUsername('monad'), testAdminUserPassword);
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          productsReducer,
        }),
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [CrudSdkService, ProductFormService],
    });

    service = TestBed.get(ProductFormService);
    crudSdk = TestBed.get(CrudSdkService);
  });

  it('#createProductFormGroup should create product form', () => {
    expect(service.createProductFormGroup().value).toMatchSnapshot();
  });

  it('#createProductExtendFormGroup should create group product extend form', () => {
    expect(
      service.createProductExtendFormGroup(EProductLevel.GROUP).value,
    ).toMatchSnapshot();
  });

  it('#createProductExtendFormGroup should create unit product extend form', () => {
    expect(
      service.createProductExtendFormGroup(EProductLevel.UNIT).value,
    ).toMatchSnapshot();
  });

  it('#createGroupProduct should create group product', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createGroupProduct({
            ...productFixture.groupProductInputBase,
            id: groupProductId,
          }),
        ),
        tap(saveResponse => {
          expect(saveResponse).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        }),
        switchMap(() => cleanup()),
      )
      .subscribe(() => {
        done();
      });
  }, 25000);

  it('#updateGroupProduct should update group product and return value', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createGroupProduct({
            ...productFixture.groupProductInputBase,
            id: groupProductId,
          }),
        ),
        switchMap(saveResponse =>
          (<CrudApi.GroupProduct>saveResponse).id
            ? service.updateGroupProduct({
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
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        }),
        switchMap(() => cleanup()),
      )
      .subscribe(() => {
        done();
      });
  }, 25000);

  it('#createUnitProduct should create unit product', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createUnitProduct({
            ...productFixture.unitProductInputBase,
            id: unitProductId,
          }),
        ),
        tap(saveResponse => {
          expect(saveResponse).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        }),
        switchMap(() => cleanup()),
      )
      .subscribe(() => {
        done();
      });
  }, 25000);

  it('#updateUnitProduct should update unit product and return value', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createUnitProduct({
            ...productFixture.unitProductInputBase,
            id: unitProductId,
          }),
        ),
        switchMap(saveResponse =>
          (<CrudApi.UnitProduct>saveResponse).id
            ? service.updateUnitProduct({
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
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        }),
        switchMap(() => cleanup()),
      )
      .subscribe(() => {
        done();
      });
  }, 25000);
});
