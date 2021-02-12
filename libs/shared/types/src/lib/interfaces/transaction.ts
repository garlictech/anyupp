import { ETransactionType } from '../enums/transaction-type';
import * as firebase from 'firebase';

export interface ITransaction {
  createdAt: firebase.firestore.Timestamp;
  chainId: string;
  unitId: string;
  userId: string;
  orders: string[];
  type: ETransactionType;
  total: number;
  currency: string;
  status?: string;
  externalTransactionId?: string;
  finishDate?: firebase.firestore.Timestamp;
  paymentDate?: firebase.firestore.Timestamp;
}
