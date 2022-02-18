/* eslint-disable @typescript-eslint/no-explicit-any */
import * as E from 'fp-ts/lib/Either';
import * as CrudApi from '@bgap/crud-gql/api';
import { of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  CalculationState_UnitAdded,
  createOrderFromCart,
  getUnit,
  getGroupCurrency,
  CalculationState_GroupCurrencyAdded,
  getNextOrderNum,
} from './create-order-from-cart.resolver';
import * as anyuppBackendLib from '@bgap/anyupp-backend-lib';
import * as utils from './utils';

jest.mock('@bgap/anyupp-backend-lib', () => ({
  __esModule: true,
  // @ts-ignore
  ...jest.requireActual('@bgap/anyupp-backend-lib'),
}));

jest.mock('./utils', () => ({
  __esModule: true,
  // @ts-ignore
  ...jest.requireActual('./utils'),
}));

const createOrderFromCart_noCart = [
  of(undefined),
  throwError('CART ERROR'),
  of({ userId: 'DIFFERENT USER ID' }),
];

test.each(createOrderFromCart_noCart)(
  'createOrderFromCart should fail without a cart',
  (returnValue, done: any) => {
    const depsFixture = {
      crudSdk: {
        GetCart: jest.fn().mockReturnValue(returnValue),
      },
      userId: 'USER ID',
    } as any;

    createOrderFromCart('CART ID')(depsFixture)
      .pipe(
        tap(res => {
          expect(res).toMatchSnapshot('RESULT');
          expect(depsFixture.crudSdk.GetCart.mock.calls).toMatchSnapshot(
            'GETCART CALLS',
          );
        }),
      )
      .subscribe(done());
  },
);

const getUnitCases = [
  { cart: { unitId: 'UNIT ID' }, unit: of(undefined) },
  { cart: { unitId: 'UNIT ID' }, unit: throwError('UNIT ERROR') },
  { cart: { unitId: 'UNIT ID' }, unit: of({ id: 'UNIT ID 1' }) },
  {
    cart: { unitId: 'UNIT ID' },
    unit: of({ id: 'UNIT ID 2', isAcceptingOrders: true }),
  },
  {
    cart: { unitId: 'UNIT ID' },
    unit: of({
      id: 'UNIT ID 3',
      isAcceptingOrders: true,
      orderPaymentPolicy: CrudApi.OrderPaymentPolicy.afterpay,
    }),
  },
  {
    cart: { unitId: 'UNIT ID' },
    unit: of({
      id: 'UNIT ID 4',
      isAcceptingOrders: true,
      orderPaymentPolicy: CrudApi.OrderPaymentPolicy.prepay,
    }),
  },
  {
    cart: { unitId: 'UNIT ID', paymentMode: {} },
    unit: of({
      id: 'UNIT ID 5',
      isAcceptingOrders: true,
    }),
  },
];

test.each(getUnitCases)('getUnit cases', ({ cart, unit }, done: any) => {
  const depsFixture = {
    crudSdk: {
      GetUnit: jest.fn().mockReturnValue(unit),
    },
  } as any;

  getUnit(depsFixture)(cart as CrudApi.Cart)
    .pipe(
      tap(res => {
        expect(depsFixture.crudSdk.GetUnit.mock.calls).toMatchSnapshot(
          'GETUNIT CALLS',
        );
        expect(res).toMatchSnapshot('RESULT');
      }),
    )
    .subscribe(done());
});

const getGroupCurrencyCases = [
  {
    inputState: { cart: { id: 'CART ID 1' }, unit: { groupId: 'GROUP ID 1' } },
    groupCurrencyResult: of(undefined),
  },
  {
    inputState: { cart: { id: 'CART ID 2' }, unit: { groupId: 'GROUP ID 2' } },
    groupCurrencyResult: throwError('GROUP CURRENCY FETCH FAILURE'),
  },
  {
    inputState: { cart: { id: 'CART ID 3' }, unit: { groupId: 'GROUP ID 3' } },
    groupCurrencyResult: of('GROUP CURRENCY'),
  },
];

test.each(getGroupCurrencyCases)(
  'getGroupCurrency cases',
  ({ inputState, groupCurrencyResult }, done: any) => {
    const depsFixture = {
      crudSdk: {
        GetGroupCurrency: jest.fn().mockReturnValue(groupCurrencyResult),
      },
    } as any;

    getGroupCurrency(depsFixture)(inputState as CalculationState_UnitAdded)
      .pipe(
        tap(res => {
          expect(
            depsFixture.crudSdk.GetGroupCurrency.mock.calls,
          ).toMatchSnapshot('GETGROUPCURRENCY CALLS');
          expect(res).toMatchSnapshot('RESULT');
        }),
      )
      .subscribe(done());
  },
);

const getNextOrderNumCases = [
  {
    inputState: {
      cart: { place: { table: 'TABLE1', seat: 'SEAT1' } },
      unit: { id: 'UNIT ID 1' },
    },
    result: of(undefined),
  },
  {
    inputState: {
      cart: { place: { table: 'TABLE2', seat: 'SEAT2' } },
      unit: { id: 'UNIT ID 2' },
    },
    result: throwError('INCREMENT ORDER NUM FAILURE'),
  },
  {
    inputState: {
      cart: { place: { table: 'TABLE3', seat: 'SEAT3' } },
      unit: { id: 'UNIT ID 3' },
    },
    result: of(10),
  },
  {
    inputState: {
      cart: {},
      unit: { id: 'UNIT ID 4' },
    },
    result: of(20),
  },
];

test.each(getNextOrderNumCases)(
  'getNextOrderNum cases',
  ({ inputState, result }, done: any) => {
    const depsFixture = {
      crudSdk: {
        GetGroupCurrency: jest.fn().mockReturnValue(result),
      },
      random: () => 0.5,
      unitTableName: 'UNIT TABLE NAME',
    } as any;

    const funcSpy = jest.fn().mockReturnValue(result);
    const incrementOrderNumSpy = jest
      .spyOn(anyuppBackendLib, 'incrementOrderNum')
      .mockReturnValue(funcSpy);

    getNextOrderNum(depsFixture)(
      inputState as CalculationState_GroupCurrencyAdded,
    )
      .pipe(
        tap(res => {
          expect(incrementOrderNumSpy.mock.calls).toMatchSnapshot(
            'INCREMENTORDERNUM DEPS CALLS',
          );
          expect(funcSpy.mock.calls).toMatchSnapshot(
            'INCREMENTORDERNUM FUNC CALLS',
          );
          expect(res).toMatchSnapshot('RESULT');
        }),
      )
      .subscribe(done());
  },
);

const getAllParentsOfUnitProductCases = [
  {
    inputState: {},
    getAllParentsOfUnitProductResult: of(
      E.left('getAllParentsOfUnitProduct FAILURE'),
    ),
  },
];

test.each(getAllParentsOfUnitProductCases)(
  'getAllParentsOfUnitProduct cases',
  ({ inputState, getAllParentsOfUnitProductResult }, done: any) => {
    const depsFixture = {} as any;

    const funcSpy = jest.fn().mockReturnValue(getAllParentsOfUnitProductResult);
    const spy = jest
      .spyOn(utils, 'getAllParentsOfUnitProduct')
      .mockReturnValue(funcSpy);

    getNextOrderNum(depsFixture)(
      inputState as CalculationState_GroupCurrencyAdded,
    )
      .pipe(
        tap(res => {
          expect(spy.mock.calls).toMatchSnapshot(
            'getAllParentsOfUnitProduct DEPS CALLS',
          );
          expect(funcSpy.mock.calls).toMatchSnapshot(
            'getAllParentsOfUnitProduct FUNC CALLS',
          );
          expect(res).toMatchSnapshot('RESULT');
        }),
      )
      .subscribe(done());
  },
);
