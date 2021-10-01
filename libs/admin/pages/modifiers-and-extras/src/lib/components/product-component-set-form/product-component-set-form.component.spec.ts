import { CrudSdkService } from 'libs/admin/shared/data-access/sdk/src';
import { switchMap, tap } from 'rxjs/operators';

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '@aws-amplify/auth';
import { DataService } from '@bgap/admin/shared/data-access/data';
import { CHAIN_ID_01, initialStateFixture } from '@bgap/admin/shared/fixtures';
import { AdminSharedFormsModule } from '@bgap/admin/shared/forms';
import { AdminSharedPipesModule } from '@bgap/admin/shared/pipes';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  getCognitoUsername,
  testAdminUserPassword,
} from '@bgap/shared/fixtures';
import {
  defaultServingMode,
  EProductComponentSetType,
} from '@bgap/shared/types';
import {
  NbCardModule,
  NbDialogModule,
  NbDialogRef,
  NbIconModule,
  NbListModule,
  NbThemeModule,
  NbToastrService,
} from '@nebular/theme';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ProductComponentSetFormComponent } from './product-component-set-form.component';

const mockProductComponentSetData = {
  chainId: CHAIN_ID_01,
  type: EProductComponentSetType.EXTRAS,
  maxSelection: 1,
  name: {
    en: 'mySet',
  },
  description: 'mock desc',
  supportedServingModes: [defaultServingMode],
  items: ['component_id'],
};

describe('ProductComponentSetFormComponent', (): void => {
  let component: ProductComponentSetFormComponent;
  let fixture: ComponentFixture<ProductComponentSetFormComponent>;
  let crudSdk: CrudSdkService;

  beforeAll(async () => {
    Auth.configure({
      ...CrudApi.awsConfig,
      authenticationFlowType: 'USER_PASSWORD_AUTH',
      aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
    });

    await Auth.signIn(getCognitoUsername('monad'), testAdminUserPassword);
  });

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [ProductComponentSetFormComponent],
        imports: [
          TranslateModule.forRoot(),
          NbThemeModule.forRoot(),
          NbDialogModule.forRoot(),
          NbCardModule,
          NbIconModule,
          NbListModule,
          AdminSharedPipesModule,
          AdminSharedFormsModule,
          FormsModule,
          ReactiveFormsModule,
        ],
        providers: [
          provideMockStore(initialStateFixture),
          {
            provide: NbDialogRef,
            useValue: { close: jest.fn() },
          },
          {
            provide: NbToastrService,
            useValue: { show: jest.fn() },
          },
          {
            provide: DataService,
            useValue: {},
          },
          CrudSdkService,
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ProductComponentSetFormComponent);
      component = fixture.componentInstance;
      crudSdk = new CrudSdkService(component['_store']);
    }),
  );

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should create empty form', (): void => {
    component.ngOnInit();

    expect(component.dialogForm.value).toMatchSnapshot();
  });

  it('should save new component set data', done => {
    // Inherited from a chain product
    component.editing = false;
    component.ngOnInit();

    // "Fill" the new values
    component.dialogForm.patchValue(mockProductComponentSetData);

    component['_save']()
      .pipe(
        switchMap(saveResponse => {
          expect(component.dialogForm.valid).toBeTruthy();
          expect(<CrudApi.ProductComponentSet>saveResponse).toMatchObject(
            mockProductComponentSetData,
          );

          // Delete test data
          return crudSdk.sdk.DeleteProductComponentSet({
            input: { id: (<CrudApi.ProductComponentSet>saveResponse).id },
          });
        }),
      )
      .subscribe({
        next() {
          done();
        },
        error(err) {
          console.error('ERR', err);
        },
      });
  }, 15000);

  it('should save updated component set data', done => {
    // Inherited from a group product
    component.productComponentSet = {
      ...mockProductComponentSetData,
      id: 'mock_id',
      createdAt: '2021-10-01T01:54:11.843Z',
      updatedAt: '2021-10-01T01:54:11.843Z',
    };
    component.editing = true;
    component.ngOnInit();

    // Change the form
    component.dialogForm.patchValue({
      description: 'modded',
      supportedServingModes: [CrudApi.ServingMode.takeaway],
    });

    // Create a base product and update it with the form above
    crudSdk.sdk
      .CreateProductComponentSet({ input: mockProductComponentSetData })
      .pipe(
        tap(createdData => {
          component.productComponentSet!.id = (<CrudApi.ProductComponentSet>(
            createdData
          )).id;
        }),
        // Save the modified form
        switchMap(() => component['_save']()),
        switchMap(saveResponse => {
          expect(component.dialogForm.valid).toBeTruthy();
          expect(
            (<CrudApi.ProductComponentSet>saveResponse).description,
          ).toEqual('modded');
          expect(
            (<CrudApi.ProductComponentSet>saveResponse).supportedServingModes,
          ).toEqual([CrudApi.ServingMode.takeaway]);

          // Delete test data
          return crudSdk.sdk.DeleteProductComponentSet({
            input: { id: (<CrudApi.ProductComponentSet>saveResponse).id },
          });
        }),
      )
      .subscribe({
        next() {
          done();
        },
        error(err) {
          console.log('ERR', err);
        },
      });
  }, 15000);
});
