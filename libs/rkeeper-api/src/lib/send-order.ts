import * as CrudApi from '@bgap/crud-gql/api';
import { pipe } from 'fp-ts/lib/function';
import axios from 'axios';
import { Method } from 'axios';
import { defer, from } from 'rxjs';

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
    data => ({
      url: `${unit.pos?.rkeeper?.endpointUri}/postorder/${unit.externalId}`,
      method: 'post' as Method,
      data,
      auth: {
        username: unit.pos?.rkeeper?.rkeeperUsername || '',
        password: unit.pos?.rkeeper?.rkeeperPassword || '',
      },
    }),
    data => defer(() => from(axios.request(data))),
  );
