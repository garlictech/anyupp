import { TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '@aws-amplify/auth';
import { UnitFormService } from '@bgap/admin/pages/units';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import {
  unitsActions,
  unitsReducer,
} from '@bgap/admin/shared/data-access/units';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  getCognitoUsername,
  testAdminUserPassword,
  testIdPrefix,
  unitFixture,
} from '@bgap/shared/fixtures';
import { Store, StoreModule } from '@ngrx/store';

describe('UnitFormService', () => {
  const unitId = `${testIdPrefix}ADMIN_UNIT_IT_UNIT_ID_01`;

  let service: UnitFormService;
  let store: Store;

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
          unitsReducer,
        }),
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [CrudSdkService, UnitFormService],
    });

    service = TestBed.get(UnitFormService);
    store = TestBed.get(Store);
  });

  it('#createUnitFormGroup should create unit form', () => {
    expect(service.createUnitFormGroup().value).toMatchSnapshot();
  });

  it('#saveForm should call the appropriate action', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    service.saveForm(unitFixture.unitInstantTakeaway);

    expect(dispatchSpy).toHaveBeenCalledWith(
      unitsActions.createUnit({
        formValue: {
          ...unitFixture.unitInstantTakeaway,
          isAcceptingOrders: false,
        },
      }),
    );

    service.saveForm(unitFixture.unitPickupInplace, unitId);

    expect(dispatchSpy).toHaveBeenCalledWith(
      unitsActions.updateUnit({
        formValue: {
          ...unitFixture.unitPickupInplace,
          id: unitId,
        },
      }),
    );
  });
});
