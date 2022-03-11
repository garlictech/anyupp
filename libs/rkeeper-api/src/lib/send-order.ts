import * as CrudApi from '@bgap/crud-gql/api';
import { pipe } from 'fp-ts/lib/function';
import { AxiosStatic } from 'axios';
import { Method } from 'axios';
import { defer, from } from 'rxjs';
import * as R from 'ramda';

export interface SendRkeeperOrderDeps {
  currentTimeISOString: () => string;
  axiosInstance: AxiosStatic;
}

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

export type RkeeperOrder = Pick<
  CrudApi.CreateOrderInput,
  'paymentMode' | 'place' | 'items'
>;

export const sendRkeeperOrder =
  (deps: SendRkeeperOrderDeps) =>
  (unit: CrudApi.Unit, orderInput: RkeeperOrder) =>
    pipe(
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
          orderInput.paymentMode?.method === CrudApi.PaymentMethod.card ? 1 : 0,
        pay_online_type:
          orderInput.paymentMode?.method === CrudApi.PaymentMethod.inapp
            ? 1
            : 0,
        delivery_time: deps.currentTimeISOString().split('.')[0],
        client: {
          phone: unit.phone,
          email: unit.email,
          ln: 'Testln',
          fn: 'Testfn',
        },
        order_number: orderInput.place
          ? parseFloat(
              `${parseInt(orderInput.place?.table)}.${parseInt(
                orderInput.place?.seat,
              )}`,
            )
          : 0.0,
        order,
      }),
      data => ({
        url: `${unit.pos?.rkeeper?.endpointUri}/postorder/${unit.externalId}`,
        method: 'post' as Method,
        data,
        auth: {
          username: unit.pos?.rkeeper?.rkeeperUsername || '',
          password: unit.pos?.rkeeper?.rkeeperPassword || '',
        },
      }),
      R.tap(x =>
        console.debug(
          'Order submitted to rkeeper:',
          JSON.stringify(x, null, 2),
        ),
      ),
      data => defer(() => from(deps.axiosInstance.request(data))),
    );
