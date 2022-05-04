import * as CrudApi from '@bgap/crud-gql/api';
import { pipe } from 'fp-ts/lib/function';
import axios, { AxiosStatic } from 'axios';
import { Method } from 'axios';
import { defer, from, Observable } from 'rxjs';
import * as R from 'ramda';
import { v1 as uuidV1 } from 'uuid';
import { mapTo, tap } from 'rxjs/operators';

export interface SendRkeeperOrderDeps {
  currentTime: () => Date;
  axiosInstance: AxiosStatic;
  uuidGenerator: () => string;
}

const defaultDeps: SendRkeeperOrderDeps = {
  currentTime: () => new Date(),
  axiosInstance: axios,
  uuidGenerator: uuidV1,
};

const processConfigSet = (configSets: CrudApi.OrderItemConfigSetInput[]) =>
  pipe(
    configSets.map(configSet => configSet.items),
    R.flatten,
    R.map(component => ({
      id: component.externalId,
      qnt: 1000,
      type: 'm',
    })),
  );

export const sendRkeeperOrder =
  (deps: SendRkeeperOrderDeps = defaultDeps) =>
  (
    unit: CrudApi.Unit,
    orderInput: CrudApi.CreateOrderInput,
  ): Observable<string | undefined> => {
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
        pay_type:
          orderInput.paymentMode?.method === CrudApi.PaymentMethod.cash ? 0 : 1,
        pay_online_type:
          orderInput.paymentMode?.method === CrudApi.PaymentMethod.cash ? 0 : 1,
        delivery_time: deps.currentTime().toISOString().split('.')[0],
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
      /*R.tap(x =>
          console.debug(
            'Order submitted to rkeeper:',
            JSON.stringify(x, null, 2),
          ),
        ),
        map(data => data?.data?.data?.remoteResponse?.remoteOrderId),
        tap(data => console.debug('RKEEPER ORDER EXTERNAL ID: ', data)),
         */
      mapTo(externalId),
    );
  };
