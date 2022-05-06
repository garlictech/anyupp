import * as fastify from 'fastify';
import * as OE from 'fp-ts-rxjs/lib/ObservableEither';
import { pipe } from 'fp-ts/lib/function';
import * as Joi from 'joi';
import * as R from 'ramda';
import { of } from 'rxjs';

import * as CrudApi from '@bgap/crud-gql/api';
import { validateSchema } from '@bgap/shared/data-validators';
import { oeTryCatch } from '@bgap/shared/utils';

export type RKeeperRequest = fastify.FastifyRequest<{
  Params: { externalUnitId: string };
}>;

export interface OrderStatusRequest {
  remoteOrderId: string;
  currentState: CrudApi.OrderStatus;
}

const requestSchema = {
  remoteOrderId: Joi.string().required(),
  currentState: Joi.string()
    .required()
    .valid('placed', 'processing', 'ready', 'served', 'failed', 'rejected'),
};

export const {
  validate: validateOrderStatusRequest,
  isType: isOrderStatusRequest,
} = validateSchema<OrderStatusRequest>(requestSchema, 'OrderStatus', true);

export interface OrderStatusHandlerDeps {
  anyuppSdk: CrudApi.CrudSdk;
  timestamp: () => number;
}

const awsAccesskeyId = process.env.API_ACCESS_KEY_ID || '';
const awsSecretAccessKey = process.env.API_SECRET_ACCESS_KEY || '';
const anyuppSdk = CrudApi.getCrudSdkForIAM(awsAccesskeyId, awsSecretAccessKey);

export interface State_UnitFetched {
  unit: CrudApi.Unit;
  request: OrderStatusRequest;
}

export const getUnit =
  (deps: OrderStatusHandlerDeps) =>
  (externalUnitId: string) =>
  (request: OrderStatusRequest) =>
    pipe(
      deps.anyuppSdk.SearchUnits({
        filter: { externalId: { eq: externalUnitId } },
      }),
      oeTryCatch,
      OE.map(res =>
        pipe(
          res?.items || [],
          R.reject(item => !item),
        ),
      ),
      OE.map(x => x as CrudApi.Unit[]),
      OE.chain(
        OE.fromPredicate(
          units => units.length === 1,
          () => `Unit with restaurant ID ${externalUnitId} cannot be found`,
        ),
      ),
      OE.map(x => ({
        unit: x[0],
        request,
      })),
    );

export interface State_OrderFetched extends State_UnitFetched {
  order: CrudApi.Order;
}

export const getOrder =
  (deps: OrderStatusHandlerDeps) =>
  (state: State_UnitFetched): OE.ObservableEither<string, State_OrderFetched> =>
    pipe(
      deps.anyuppSdk.SearchOrders({
        filter: {
          and: [
            { unitId: { eq: state.unit.id } },
            { externalId: { eq: state.request.remoteOrderId } },
          ],
        },
      }),
      oeTryCatch,
      OE.map(res =>
        pipe(
          res?.items || [],
          R.reject(item => !item),
        ),
      ),
      OE.map(x => x as CrudApi.Order[]),
      OE.chain(
        OE.fromPredicate(
          orders => orders.length === 1,
          () =>
            `Order with external ID ${state.request.remoteOrderId} cannot be found`,
        ),
      ),
      OE.map(orders => ({
        ...state,
        order: orders[0],
      })),
    );

export const updateOrderStatus =
  (deps: OrderStatusHandlerDeps) => (state: State_OrderFetched) =>
    pipe(
      deps.anyuppSdk.UpdateOrder({
        input: {
          id: state.order.id,
          statusLog: [
            ...state.order.statusLog,
            {
              userId: 'remote rkeeper',
              status: state.request.currentState,
              ts: deps.timestamp(),
            },
          ],
          currentStatus: state.request.currentState,
          archived: R.includes(state.request.currentState, [
            CrudApi.OrderStatus.failed,
            CrudApi.OrderStatus.served,
          ]),
        },
      }),
      oeTryCatch,
      OE.chain(
        OE.fromPredicate(
          order => !!order,
          () =>
            `Order with external ID ${state.request.remoteOrderId} not found`,
        ),
      ),
    );

export const orderStatusHandlerLogic =
  (deps: OrderStatusHandlerDeps) =>
  (request: RKeeperRequest, reply: fastify.FastifyReply) => {
    const externalUnitId = request.params.externalUnitId;
    console.log('Handling order status update for unit ', externalUnitId);
    console.debug('Request:', request);

    return pipe(
      request.body,
      validateOrderStatusRequest,
      oeTryCatch,
      OE.chain(getUnit(deps)(externalUnitId)),
      OE.chain(getOrder(deps)),
      OE.chain(updateOrderStatus(deps)),
      OE.fold(
        error =>
          of(
            reply.status(400).send({
              error,
            }),
          ),
        () => of(reply.send({ success: true })),
      ),
    ).toPromise();
  };

export const orderStatusHandler = (
  request: RKeeperRequest,
  reply: fastify.FastifyReply,
) =>
  orderStatusHandlerLogic({ anyuppSdk, timestamp: () => Date.now() })(
    request,
    reply,
  );
