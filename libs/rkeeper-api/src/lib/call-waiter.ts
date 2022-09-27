import { oeTryCatch } from '@bgap/shared/utils';
import { pipe } from 'fp-ts/lib/function';
import { CallWaiterInput, Unit } from '@bgap/domain';
import { AxiosStatic } from 'axios';
import { sendOrderToRkeeperPOS } from './send-order';

export interface RKeeperWaiterCallerDeps {
  currentTimeISOString: () => string;
  axiosInstance: AxiosStatic;
  uuidGenerator: () => string;
}

export const callWaiter =
  (deps: RKeeperWaiterCallerDeps) => (unit: Unit, input: CallWaiterInput) =>
    pipe(
      {
        objectid: unit.externalId,
        remoteId: unit.externalId,
        order_type: 1,
        pay_type: 0,
        pay_online_type: 0,
        delivery_time: deps.currentTimeISOString().split('.')[0],
        client: {
          phone: unit.phone,
          email: unit.email,
          ln: 'Biborka',
        },
        order_number: parseInt(input.place.table) || 0,
        guest_label: parseInt(input.place?.seat) || 0,
        guest_name: input.guestLabel,
        remoteOrderId: deps.uuidGenerator(),
        order: {
          id: unit.pos?.rkeeper?.waiterOrderId,
          type: 'd',
          qnt: 1,
        },
      },
      order => sendOrderToRkeeperPOS(deps)(order, unit, deps.uuidGenerator()),
      oeTryCatch,
    );
