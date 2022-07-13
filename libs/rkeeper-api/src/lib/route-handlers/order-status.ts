import * as fastify from 'fastify';
import * as OE from 'fp-ts-rxjs/lib/ObservableEither';
import { pipe } from 'fp-ts/lib/function';
import * as Joi from 'joi';
import * as R from 'ramda';
import { of } from 'rxjs';

import { validateSchema } from '@bgap/shared/data-validators';
import { oeTryCatch } from '@bgap/shared/utils';
import { CrudSdk, getCrudSdkForIAM } from '@bgap/crud-gql/api';
import { Order, OrderStatus, Unit } from '@bgap/domain';
import {
  FCMPushNotificationService,
  IFCMPushNotificationService,
} from '@bgap/firebase-api';

export type RKeeperRequest = fastify.FastifyRequest<{
  Params: { externalUnitId: string };
}>;

export interface OrderStatusRequest {
  remoteOrderId: string;
  currentState: OrderStatus;
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
  anyuppSdk: CrudSdk;
  timestamp: () => number;
  getPushNotificationService: () => IFCMPushNotificationService;
}

const awsAccesskeyId = process.env.API_ACCESS_KEY_ID || '';
const awsSecretAccessKey = process.env.API_SECRET_ACCESS_KEY || '';

/*
  base64 encode the json after removing line breaks, and set the result as the env variable
  e.g.: cat /file/path/to/firebase/cert.json | tr -d '\n' | base64 | tr -d '\n'
  e.g.: export FIREBASE_SERVICE_ACCOUNT_CERT=`cat /file/path/to/firebase/cert.json | tr -d '\n' | base64 | tr -d '\n'`
 */
const serviceAccountCertJSONString = Buffer.from(
  process.env.FIREBASE_SERVICE_ACCOUNT_CERT || 'READ_COMMENT_ABOVE',
  'base64',
).toString();

const anyuppSdk = getCrudSdkForIAM(awsAccesskeyId, awsSecretAccessKey);

export interface State_UnitFetched {
  unit: Unit;
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
      OE.map(x => x as Unit[]),
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
  order: Order;
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
      OE.map(x => x as Order[]),
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
            OrderStatus.failed,
            OrderStatus.served,
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
      OE.map(updatedOrder => ({
        ...state,
        order: updatedOrder ? updatedOrder : state.order,
      })),
    );

const sendPushNotification =
  (deps: OrderStatusHandlerDeps) => (state: State_OrderFetched) =>
    deps
      .getPushNotificationService()
      .sendOrderStatusChangePushNotification({
        order: state.order,
      })
      .pipe(oeTryCatch);

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
      OE.chain(sendPushNotification(deps)),
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
  orderStatusHandlerLogic({
    anyuppSdk,
    timestamp: () => Date.now(),
    getPushNotificationService: () =>
      new FCMPushNotificationService({
        sdk: anyuppSdk,
        serviceAccountCertJSONString,
      }),
  })(request, reply);
