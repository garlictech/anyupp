import { OrderStatus } from '@bgap/domain';
import { from, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  getOrder,
  getUnit,
  orderStatusHandlerLogic,
  updateOrderStatus,
  validateOrderStatusRequest,
} from './order-status';

const getUnitCases = [
  {
    SearchUnitResult: of(undefined),
    label: 'SearchUnits finds no unit',
  },
  {
    SearchUnitResult: throwError('UNIT SEARCH ERROR'),
    label: 'SearchUnits throws error',
  },
  {
    SearchUnitResult: of({ items: [{}, {}] }),
    label: 'SearchUnits finds multiple unit (meaning database error)',
  },
  {
    SearchUnitResult: of({ items: [{ id: 'UNIT FOUND' }] }),
    label: 'SearchUnits finds unit',
  },
];

test.each(getUnitCases)(
  'getUnit case: $label',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ({ SearchUnitResult }, done: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deps: any = {
      anyuppSdk: {
        SearchUnits: jest.fn().mockReturnValue(SearchUnitResult),
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request: any = 'THE REQUEST';

    getUnit(deps)('EXTERNAL UNIT ID')(request)
      .pipe(
        tap(res => {
          expect(res).toMatchSnapshot('RESULT');
          expect(deps.anyuppSdk.SearchUnits.mock.calls).toMatchSnapshot(
            'SearchUnits calls',
          );
        }),
      )
      .subscribe(() => done());
  },
);

const getOrderCases = [
  {
    SearchOrderResult: of(undefined),
    label: 'SearchOrders finds no order',
  },
  {
    SearchOrderResult: throwError('order SEARCH ERROR'),
    label: 'SearchOrders throws error',
  },
  {
    SearchOrderResult: of({ items: [{}, {}] }),
    label: 'SearchOrders finds multiple order (meaning database error)',
  },
  {
    SearchOrderResult: of({ items: [{ id: 'order FOUND' }] }),
    label: 'SearchOrders finds order',
  },
];

test.each(getOrderCases)(
  'getOrder case: $label',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ({ SearchOrderResult }, done: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deps: any = {
      anyuppSdk: {
        SearchOrders: jest.fn().mockReturnValue(SearchOrderResult),
      },
    };

    getOrder(deps)({
      unit: { id: 'UNIT ID' },
      request: { remoteOrderId: 'REMOTE ORDER ID' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
      .pipe(
        tap(res => {
          expect(res).toMatchSnapshot('RESULT');
          expect(deps.anyuppSdk.SearchOrders.mock.calls).toMatchSnapshot(
            'SearchOrders calls',
          );
        }),
      )
      .subscribe(() => done());
  },
);

const updateOrderStatusCases = [
  {
    UpdateOrderResult: of(undefined),
    status: OrderStatus.served,
    label: 'UpdateOrder finds no order',
  },
  {
    UpdateOrderResult: throwError('UPDATE ORDER ERROR'),
    status: OrderStatus.served,
    label: 'UpdateOrder throws error',
  },
  {
    UpdateOrderResult: of('SUCCESSFULL UPDATE'),
    status: OrderStatus.served,
    label: 'UpdateOrder succes, status: served',
  },
  {
    UpdateOrderResult: of('SUCCESSFULL UPDATE'),
    status: OrderStatus.failed,
    label: 'UpdateOrder succes, status: failed',
  },
  {
    UpdateOrderResult: of('SUCCESSFULL UPDATE'),
    status: OrderStatus.ready,
    label: 'UpdateOrder succes, status: ready',
  },
];

test.each(updateOrderStatusCases)(
  'updateOrderStatus case: $label',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ({ UpdateOrderResult, status }, done: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deps: any = {
      anyuppSdk: {
        UpdateOrder: jest.fn().mockReturnValue(UpdateOrderResult),
      },
      timestamp: () => 99999,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inputStatus: any = {
      unit: { id: 'UNIT ID' },
      order: { id: 'ORDER ID', statusLog: ['CURRENT STATUSLOG'] },
      request: {
        currentState: status,
        remoteOrderId: 'REMOTE ORDER ID',
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    };

    updateOrderStatus(deps)(inputStatus)
      .pipe(
        tap(res => {
          expect(res).toMatchSnapshot('RESULT');
          expect(deps.anyuppSdk.UpdateOrder.mock.calls).toMatchSnapshot(
            'UpdateOrder calls',
          );
        }),
      )
      .subscribe(() => done());
  },
);

const orderStatusHandlerCases = [
  {
    result: throwError('UPDATE ORDER ERROR'),
    label: 'UpdateOrder throws error',
  },
  {
    result: of(true),
    label: 'everything is OK',
  },
];

test.each(orderStatusHandlerCases)(
  'orderStatusHandler case: $label',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ({ result }, done: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deps: any = {
      anyuppSdk: {
        SearchUnits: jest
          .fn()
          .mockReturnValue(of({ items: [{ id: 'UNIT FOUND' }] })),
        SearchOrders: jest.fn().mockReturnValue(
          of({
            items: [{ id: 'ORDER FOUND', statusLog: ['CURRENT STATUSLOG'] }],
          }),
        ),
        UpdateOrder: jest.fn().mockReturnValue(result),
      },
      timestamp: () => 99999,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request: any = {
      body: {
        remoteOrderId: 'REMOTE ORDER ID',
        currentState: OrderStatus.ready,
      },
      params: {
        externalUnitId: 'EXTERNAL UNIT ID',
      },
    };

    const sendSpy = jest.fn().mockReturnValue('SEND SPY RESULT');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reply: any = {
      status: jest.fn().mockReturnValue({ send: sendSpy }),
      send: jest.fn().mockReturnValue('SEND RESULT'),
    };

    from(orderStatusHandlerLogic(deps)(request, reply))
      .pipe(
        tap(res => {
          expect(res).toMatchSnapshot('RESULT');
          expect(reply.status.mock.calls).toMatchSnapshot('reply status calls');
          expect(reply.send.mock.calls).toMatchSnapshot('reply send calls');
          expect(sendSpy.mock.calls).toMatchSnapshot('reply sendSpy calls');
        }),
      )
      .subscribe(() => done());
  },
);

const validateRequestCases = [
  {},
  null,
  { remoteOrderId: undefined },
  {
    currentState: 'ready',
    remoteOrderId: 'REMOTE ORDER ID 1',
  },
  {
    currentState: 'foobar',
    remoteOrderId: 'REMOTE ORDER ID 2',
  },
];

test.each(validateRequestCases)(
  'validateRequestCases',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (request, done: any) => {
    validateOrderStatusRequest(request).subscribe(
      res => expect(res).toMatchSnapshot(JSON.stringify(request)),
      err => {
        expect(err).toMatchSnapshot(JSON.stringify(request));
        done();
      },
      () => done(),
    );
  },
);
