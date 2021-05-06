import { PaymentMode } from './payment';
import { IOrderItem, IPlace } from './order';

export interface ICart {
  __typename?: 'Cart';
  id: string;
  userId: string;
  unitId: string;
  takeAway: boolean;
  place?: IPlace;
  paymentMode?: PaymentMode;
  items: Array<IOrderItem>;
  createdAt: string;
  updatedAt: string;
}
