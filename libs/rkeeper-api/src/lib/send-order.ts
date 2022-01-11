import * as CrudApi from '@bgap/crud-gql/api';
import { pipe } from 'fp-ts/lib/function';
import axios from 'axios';
import { defer, from } from 'rxjs';
import * as R from 'ramda';

export const sendRkeeperOrder = (
  unit: CrudApi.Unit,
  orderInput: CrudApi.CreateOrderInput,
) =>
  pipe(
    orderInput.items.map(item => ({
      id: item.externalId,
      type: 'd',
      qnt: item.quantity * 1000,
    })),

    R.tap(console.warn),
    order => ({
      objectid: unit.externalId,
      order_type: 1,
      pay_type:
        orderInput.paymentMode.method === CrudApi.PaymentMethod.cash ? 0 : 1,
      pay_online_type:
        orderInput.paymentMode.method === CrudApi.PaymentMethod.cash ? 0 : 1,
      delivery_time: Date(),
      client: {
        phone: unit.phone,
        email: unit.email,
        ln: 'Testln',
        fn: 'Testfn',
      },
      order,
    }),

    R.tap(x => console.warn(JSON.stringify(x, null, 2))),
    data => ({
      url: `${unit.pos?.rkeeper?.endpointUri}/postorder/${unit.externalId}`,
      method: 'post',
      data,
      auth: {
        username: unit.pos?.rkeeper?.rkeeperUsername || '',
        password: unit.pos?.rkeeper?.rkeeperPassword || '',
      },
    }),

    R.tap(console.warn),
    data => defer(() => from(axios.request(data))),
  );
