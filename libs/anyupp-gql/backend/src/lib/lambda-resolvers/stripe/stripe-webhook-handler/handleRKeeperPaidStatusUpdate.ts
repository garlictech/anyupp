import { StripeResolverDepsUnauth } from '../stripe.utils';
import { loadOrder, loadUnit } from '../stripe-graphql-crud';
import { Order, Unit, PosType } from '@bgap/domain';
import { sendOrderPaid } from '@bgap/rkeeper-api';
import axios from 'axios';

interface Params {
  deps: StripeResolverDepsUnauth;
  orderId: string;
}

export const handleRKeeperPaidStatusUpdate = async (
  params: Params,
): Promise<void> => {
  const { deps, orderId } = params;

  const order: Order | null | undefined = await loadOrder(orderId)(deps);
  if (!order) {
    throw Error(
      `handleRKeeperPaidStatusUpdate error: Order not found with id: ${orderId}`,
    );
  }

  const unit: Unit | null | undefined = await loadUnit(order.unitId)(deps);
  if (!unit) {
    throw Error(
      `handleRKeeperPaidStatusUpdate error: Unit not found with id: ${order.unitId}`,
    );
  }

  if (
    order.visitId &&
    unit.externalId &&
    unit.pos?.type === PosType.rkeeper &&
    unit.pos.rkeeper
  ) {
    await sendOrderPaid({
      rKeeperPosConfig: unit.pos.rkeeper,
      restaurantId: unit.externalId,
      visitId: order.visitId,
      axiosInstance: axios,
    });

    console.debug(
      `handleRKeeperPaidStatusUpdate set paid status for order: ${orderId}`,
    );
  }
};
