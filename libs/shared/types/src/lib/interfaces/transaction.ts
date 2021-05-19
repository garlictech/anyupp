import { IOrder } from './order';
import { IUser } from './user';
// import * as firebase from 'firebase';

export interface ITransaction {
  // createdAt: firebase.firestore.Timestamp;
  id: string;
  // unitId: string;
  userId: string;
  user?: IUser | null;
  orderId: string;
  order?: IOrder | null;
  type: string; //ETransactionType;
  total?: number | null;
  currency?: string | null;
  status?: string | null;
  externalTransactionId?: string;
  createdAt: string;
  updatedAt: string;
  // finishDate?: firebase.firestore.Timestamp;
  // paymentDate?: firebase.firestore.Timestamp;
}
