import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '@aws-amplify/auth';
import { DataService } from '@bgap/admin/shared/data-access/data';
import * as fp from 'lodash/fp';
import {
  CHAIN_ID_01,
  GROUP_ID_01,
  groupProductFixture,
  initialStateFixture,
  UNIT_ID_01,
  unitProductFixture,
  chainProductFixture,
} from '@bgap/admin/shared/fixtures';
import { AdminSharedFormsModule } from '@bgap/admin/shared/forms';
import { AdminSharedPipesModule } from '@bgap/admin/shared/pipes';
import { awsConfig } from '@bgap/crud-gql/api';
import {
  getCognitoUsername,
  testAdminUserPassword,
} from '@bgap/shared/fixtures';
import * as CrudApi from '@bgap/crud-gql/api';
import { EProductLevel, EVariantAvailabilityType } from '@bgap/shared/types';
import {
  NbCardModule,
  NbDialogModule,
  NbDialogRef,
  NbIconModule,
  NbThemeModule,
  NbToastrService,
} from '@nebular/theme';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ProductExtendFormComponent } from '@bgap/admin/pages/products';

import { switchMap, tap } from 'rxjs/operators';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';

describe('ProductExtendFormComponent', (): void => {
  let component: ProductExtendFormComponent;
  let fixture: ComponentFixture<ProductExtendFormComponent>;
  let crudSdk: CrudSdkService;

  beforeAll(async () => {
    Auth.configure({
      ...awsConfig,
      authenticationFlowType: 'USER_PASSWORD_AUTH',
      aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
    });

    await Auth.signIn(getCognitoUsername('monad'), testAdminUserPassword);
  });

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [ProductExtendFormComponent],
        imports: [
          TranslateModule.forRoot(),
          NbThemeModule.forRoot(),
          NbDialogModule.forRoot(),
          NbCardModule,
          NbIconModule,
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
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ProductExtendFormComponent);
      component = fixture.componentInstance;
      crudSdk = new CrudSdkService(component['_store']);

      // Mock selector updates
      component['_selectedUnitId'] = UNIT_ID_01;
      component['_selectedGroupId'] = GROUP_ID_01;
      component['_selectedChainId'] = CHAIN_ID_01;
    }),
  );

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  describe('Group Form', (): void => {
    beforeEach((): void => {
      component.productLevel = EProductLevel.GROUP;
    });

    it('should create empty group product form', (): void => {
      component.ngOnInit();

      expect(component.dialogForm.value).toMatchSnapshot();
    });

    it('should save new group product data', done => {
      // Inherited from a chain product
      component.product = {
        ...chainProductFixture,
      };
      component.editing = false;
      component.ngOnInit();

      // "Fill" the new values
      component.dialogForm.patchValue({
        tax: groupProductFixture.tax,
        takeawayTax: groupProductFixture.takeawayTax,
      });

      component['_save']()
        .pipe(
          switchMap(saveResponse => {
            expect(component.dialogForm.valid).toBeTruthy();
            expect((<CrudApi.GroupProduct>saveResponse).tax).toEqual(
              groupProductFixture.tax,
            );
            expect((<CrudApi.GroupProduct>saveResponse).takeawayTax).toEqual(
              groupProductFixture.takeawayTax,
            );

            // Delete test data
            return crudSdk.sdk.DeleteGroupProduct({
              input: { id: (<CrudApi.GroupProduct>saveResponse).id },
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

    it('should save updated group product data', done => {
      // Inherited from a group product
      component.product = {
        ...groupProductFixture,
      };
      component.editing = true;
      component.ngOnInit();

      // Change the form
      component.dialogForm.patchValue({
        tax: 22,
        takeawayTax: 33,
      });

      // Create a base product and update it with the form above
      component['_productFormService']
        .createGroupProduct(
          fp.omit(['id', 'createdAt', 'updatedAt'], groupProductFixture),
        )
        .pipe(
          tap(createdProductData => {
            if (component.product) {
              component.product.id = (<CrudApi.GroupProduct>(
                createdProductData
              )).id;
            }
          }),
          // Save the modified form
          switchMap(() => component['_save']()),
          switchMap(saveResponse => {
            expect(component.dialogForm.valid).toBeTruthy();
            expect((<CrudApi.GroupProduct>saveResponse).tax).toEqual(22);
            expect((<CrudApi.GroupProduct>saveResponse).takeawayTax).toEqual(
              33,
            );

            // Delete test data
            return crudSdk.sdk.DeleteGroupProduct({
              input: { id: (<CrudApi.GroupProduct>saveResponse).id },
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

  describe('Unit Form', (): void => {
    beforeEach((): void => {
      component.productLevel = EProductLevel.UNIT;
    });

    it('should create empty unit product form', (): void => {
      component.ngOnInit();

      expect(component.dialogForm.value).toMatchSnapshot();
    });

    it('should save new unit product data', done => {
      // Inherited from a group product
      component.product = {
        ...groupProductFixture,
      };
      component.editing = false;
      component.ngOnInit();

      // "Fill" the new values
      component.dialogForm.patchValue({
        laneId: unitProductFixture.laneId,
        supportedServingModes: unitProductFixture.supportedServingModes,
      });
      (<FormArray>(
        component.dialogForm.controls['variants']
      )).controls[0].patchValue({
        availabilities: [
          {
            type: EVariantAvailabilityType.ALWAYS,
            price: 200,
          },
        ],
      });

      component['_save']()
        .pipe(
          switchMap(saveResponse => {
            expect(component.dialogForm.valid).toBeTruthy();
            expect((<CrudApi.UnitProduct>saveResponse).laneId).toEqual(
              unitProductFixture.laneId,
            );
            expect(
              (<CrudApi.UnitProduct>saveResponse).supportedServingModes,
            ).toEqual(unitProductFixture.supportedServingModes);
            expect(
              (<CrudApi.UnitProduct>saveResponse).variants?.[0]
                ?.availabilities?.[0],
            ).toEqual({
              type: 'A',
              dayFrom: '',
              dayTo: '',
              timeFrom: '',
              timeTo: '',
              price: 200,
            });

            // Delete test data
            return crudSdk.sdk.DeleteGroupProduct({
              input: { id: (<CrudApi.GroupProduct>saveResponse).id },
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

    it('should save updated unit product data', done => {
      // Inherited from a group product
      component.product = {
        ...unitProductFixture,
      };
      component.editing = true;
      component.ngOnInit();

      // Change the form
      component.dialogForm.patchValue({
        laneId: 'modded',
        supportedServingModes: [CrudApi.ServingMode.inplace],
      });

      // Create a base product and update it with the form above
      component['_productFormService']
        .createUnitProduct(
          fp.omit(['id', 'createdAt', 'updatedAt'], unitProductFixture),
        )
        .pipe(
          tap(createdProductData => {
            if (component.product) {
              component.product.id = (<CrudApi.UnitProduct>(
                createdProductData
              )).id;
            }
          }),
          // Save the modified form
          switchMap(() => component['_save']()),
          switchMap(saveResponse => {
            expect(component.dialogForm.valid).toBeTruthy();
            expect((<CrudApi.UnitProduct>saveResponse).laneId).toEqual(
              'modded',
            );
            expect(
              (<CrudApi.UnitProduct>saveResponse).supportedServingModes,
            ).toEqual([CrudApi.ServingMode.inplace]);

            // Delete test data
            return crudSdk.sdk.DeleteGroupProduct({
              input: { id: (<CrudApi.GroupProduct>saveResponse).id },
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
});
