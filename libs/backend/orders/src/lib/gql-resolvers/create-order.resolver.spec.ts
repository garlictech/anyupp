/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  CalculationState_UnitAdded,
  getUnit,
  getNextOrderNum,
  placeOrder,
  handleRkeeperOrder,
  CalculationState_OrderAdded,
  createOrder,
} from './create-order.resolver';
import * as anyuppBackendLib from '@bgap/anyupp-backend-lib';
import * as rkeeperApi from '@bgap/rkeeper-api';
import { CreateOrderInput, OrderPaymentPolicy, PosType } from '@bgap/domain';

jest.mock('@bgap/rkeeper-api', () => ({
  __esModule: true,
  // @ts-ignore
  ...jest.requireActual('@bgap/rkeeper-api'),
}));

jest.mock('@bgap/anyupp-backend-lib', () => ({
  __esModule: true,
  // @ts-ignore
  ...jest.requireActual('@bgap/anyupp-backend-lib'),
}));

Date.now = () => 1627909024677;

const getUnitCases = [
  { orderInput: { unitId: 'UNIT ID' }, unit: of(undefined) },
  { orderInput: { unitId: 'UNIT ID' }, unit: throwError('UNIT ERROR') },
  { orderInput: { unitId: 'UNIT ID' }, unit: of({ id: 'UNIT ID 1' }) },
  {
    orderInput: { unitId: 'UNIT ID' },
    unit: of({ id: 'UNIT ID 2', isAcceptingOrders: true }),
  },
  {
    orderInput: { unitId: 'UNIT ID' },
    unit: of({
      id: 'UNIT ID 3',
      isAcceptingOrders: true,
      orderPaymentPolicy: OrderPaymentPolicy.afterpay,
    }),
  },
  {
    orderInput: { unitId: 'UNIT ID' },
    unit: of({
      id: 'UNIT ID 4',
      isAcceptingOrders: true,
      orderPaymentPolicy: OrderPaymentPolicy.prepay,
    }),
  },
  {
    orderInput: { unitId: 'UNIT ID', paymentMode: {} },
    unit: of({
      id: 'UNIT ID 5',
      isAcceptingOrders: true,
    }),
  },
];

test.each(getUnitCases)('getUnit cases', ({ orderInput, unit }, done: any) => {
  const depsFixture = {
    crudSdk: {
      GetUnit: jest.fn().mockReturnValue(unit),
    },
  } as any;

  getUnit(depsFixture)(orderInput as CreateOrderInput)
    .pipe(
      tap(res => {
        expect(depsFixture.crudSdk.GetUnit.mock.calls).toMatchSnapshot(
          'GETUNIT CALLS',
        );
        expect(res).toMatchSnapshot('RESULT');
      }),
    )
    .subscribe(() => done());
});

const getNextOrderNumCases = [
  {
    inputState: {
      order: { place: { table: 'TABLE1', seat: 'SEAT1' } },
      unit: { id: 'UNIT ID 1' },
    },
    result: of(undefined),
  },
  {
    inputState: {
      order: { place: { table: 'TABLE2', seat: 'SEAT2' } },
      unit: { id: 'UNIT ID 2' },
    },
    result: throwError('INCREMENT ORDER NUM FAILURE'),
  },
  {
    inputState: {
      order: { place: { table: 'TABLE3', seat: 'SEAT3' } },
      unit: { id: 'UNIT ID 3' },
    },
    result: of(10),
  },
  {
    inputState: {
      order: {},
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

    getNextOrderNum(depsFixture)(inputState as CalculationState_UnitAdded)
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
      .subscribe(() => done());
  },
);

const placeOrderCases = [
  {
    inputState: {
      order: { unitId: 'THE ORDER UNIT ID' },
    },
    result: Promise.resolve({
      Attributes: { unitId: 'THE ORDER UNIT ID IN ATTRIBUTES' },
    }),
    label: 'All good',
  },
  {
    inputState: {
      order: { unitId: 'THE ORDER UNIT ID' },
    },
    result: Promise.reject('DB ERRORED'),
    label: 'Error happened',
  },
  {
    inputState: {
      order: { unitId: 'THE ORDER UNIT ID', id: 'USER GIVEN ORDER ID' },
    },
    result: Promise.resolve({
      Attributes: { unitId: 'THE ORDER UNIT ID IN ATTRIBUTES' },
    }),
    label: 'Order ID specified',
  },
];

test.each(placeOrderCases)(
  'placeOrderCases cases',
  ({ inputState, result, label }, done: any) => {
    const depsFixture = {
      docClient: {
        put: jest.fn().mockReturnValue({ promise: () => result }),
      },
      uuid: () => 'THE UUID',
      orderTableName: 'ORDER TABLE NAME',
      currentTimeISOString: () => new Date('2022-02-01').toISOString(),
      uuidGenerator: () => 'UUID',
    } as any;

    placeOrder(depsFixture)(inputState as CalculationState_UnitAdded)
      .pipe(
        tap(res => {
          expect(depsFixture.docClient.put.mock.calls).toMatchSnapshot(
            `Case: "${label}", PUT CALLS`,
          );

          expect(res).toMatchSnapshot(`Case: "${label}", RESULT`);
        }),
      )
      .subscribe(() => done());
  },
);

const handleRkeeperOrderCases = [
  {
    inputState: {
      unit: { id: 'NOT AN RKEEPER UNIT' },
      order: { unitId: 'THE ORDER UNIT ID' },
    },
    result: of({}),
  },
  {
    inputState: {
      unit: {
        id: 'AN RKEEPER UNIT',
        pos: {
          type: PosType.rkeeper,
        },
      },
      order: { unitId: 'THE ORDER UNIT ID' },
    },
    result: of({}),
  },
  {
    inputState: {
      unit: {
        id: 'AN RKEEPER UNIT',
        pos: {
          type: PosType.rkeeper,
        },
      },
      order: { unitId: 'THE ORDER UNIT ID' },
    },
    result: throwError('RKEEPER ERROR'),
  },
];

xtest.each(handleRkeeperOrderCases)(
  'handleRkeeperOrderCases cases',
  ({ inputState, result }, done: any) => {
    const depsFixture = {
      currentTimeISOString: () => new Date('2022-02-01').toISOString(),
      axiosInstance: {},
      uuid: () => 'THE UUID',
    } as any;

    const funcSpy = jest.fn().mockReturnValue(result);
    const rkeeperSpy = jest
      .spyOn(rkeeperApi, 'sendRkeeperOrder')
      .mockReturnValue(funcSpy);

    handleRkeeperOrder(depsFixture)(inputState as CalculationState_OrderAdded)
      .pipe(
        tap(res => {
          expect(rkeeperSpy.mock.calls).toMatchSnapshot('RKEEPER DEPS CALLS');
          expect(funcSpy.mock.calls).toMatchSnapshot('RKEEPER FUNC CALLS');
          expect(res).toMatchSnapshot('RESULT');
        }),
      )
      .subscribe(() => done());
  },
);

const createOrderCases = [
  { orderInput: { unitId: 'UNIT ID' }, result: throwError('INCREMENT ERROR') },
  { orderInput: { unitId: 'UNIT ID' }, result: of(10) },
];

test.each(createOrderCases)(
  'createOrderCases cases',
  ({ orderInput, result }, done: any) => {
    const depsFixture = {
      crudSdk: {
        GetUnit: jest.fn().mockReturnValue(
          of({
            id: 'THE UNTI ID',
            isAcceptingOrders: true,
            orderPaymentPolicy: OrderPaymentPolicy.afterpay,
          }),
        ),
      },
      random: () => 0.5,
      unitTableName: 'UNIT TABLE NAME',
      currentTimeISOString: () => new Date('2022-02-01').toISOString(),
      axiosInstance: {},
      uuid: () => 'THE UUID',
      docClient: {
        put: jest.fn().mockReturnValue({
          promise: () =>
            Promise.resolve({
              Attributes: { unitId: 'THE ORDER UNIT ID IN ATTRIBUTES' },
            }),
        }),
      },
    } as any;

    const incrementFuncSpy = jest.fn().mockReturnValue(result);
    jest
      .spyOn(anyuppBackendLib, 'incrementOrderNum')
      .mockReturnValue(incrementFuncSpy);

    const rkeeperFuncSpy = jest.fn().mockReturnValue(of({}));
    jest.spyOn(rkeeperApi, 'sendRkeeperOrder').mockReturnValue(rkeeperFuncSpy);

    createOrder(orderInput as CreateOrderInput)(depsFixture)
      .pipe(
        tap(res => {
          expect(res).toMatchSnapshot('RESULT');
        }),
        catchError(err => {
          expect(err).toMatchSnapshot('ERROR RESULT');
          return of({});
        }),
      )
      .subscribe(() => done());
  },
);
