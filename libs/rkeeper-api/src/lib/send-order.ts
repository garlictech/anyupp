import { pipe } from 'fp-ts/lib/function';
import { AxiosStatic } from 'axios';
import { Method } from 'axios';
import { defer, from, Observable } from 'rxjs';
import * as R from 'ramda';
import { tap, map } from 'rxjs/operators';
import {
  CreateOrderInput,
  OrderItemConfigSetInput,
  PaymentMethod,
  Unit,
} from '@bgap/domain';

export interface SendRkeeperOrderDeps {
  currentTimeISOString: () => string;
  axiosInstance: AxiosStatic;
  uuidGenerator: () => string;
}

const processConfigSet = (configSets: OrderItemConfigSetInput[]) =>
  pipe(
    configSets.map(configSet => configSet.items),
    R.flatten,
    R.map(component => ({
      id: component.externalId,
      qnt: 1000,
      type: 'm',
    })),
  );

export type RkeeperOrder = Pick<
  CreateOrderInput,
  'paymentMode' | 'place' | 'items'
>;

export interface SendRKeeperOrderResponse {
  externalId: string;
  visitId: string;
}

export const sendRkeeperOrder =
  (deps: SendRkeeperOrderDeps) =>
  (
    unit: Unit,
    orderInput: CreateOrderInput,
  ): Observable<SendRKeeperOrderResponse> => {
    const externalId = deps.uuidGenerator();

    return pipe(
      orderInput.items.map(item =>
        pipe(
          {
            id: item.externalId,
            type: 'd',
            qnt: item.quantity * 1000,
          },
          rkeeperItem =>
            item.configSets
              ? { ...rkeeperItem, items: processConfigSet(item.configSets) }
              : rkeeperItem,
        ),
      ),
      order => ({
        objectid: unit.externalId,
        remoteId: unit.externalId,
        order_type: 1,
        pay_type: orderInput.paymentMode?.method === PaymentMethod.card ? 1 : 0,
        pay_online_type:
          orderInput.paymentMode?.method === PaymentMethod.inapp ? 1 : 0,
        delivery_time: deps.currentTimeISOString().split('.')[0],
        client: {
          phone: unit.phone,
          email: unit.email,
          ln: 'Biborka',
        },
        order_number: parseInt(orderInput.place?.table ?? '0'),
        guest_label: parseInt(orderInput.place?.seat ?? '0'),
        guest_name: orderInput.guestLabel ?? 'unknown',
        remoteOrderId: externalId,
        order,
      }),
      R.tap(x => console.debug('ORDER SENT:', JSON.stringify(x, null, 2))),
      data => ({
        url: `${unit.pos?.rkeeper?.endpointUri}/postorder/${unit.externalId}`,
        method: 'post' as Method,
        data,
        auth: {
          username: unit.pos?.rkeeper?.rkeeperUsername || '',
          password: unit.pos?.rkeeper?.rkeeperPassword || '',
        },
      }),
      data => defer(() => from(deps.axiosInstance.request(data))),
      tap(data =>
        console.debug('RKEEPER RESPONSE: ', JSON.stringify(data.data, null, 2)),
      ),
      map(rKeeperResponse => ({
        externalId,
        visitId: rKeeperResponse.data?.data?.data?.visit_id,
      })),
    );
  };
