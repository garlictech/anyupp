import * as fbAdmin from 'firebase-admin';

import { Injectable } from '@nestjs/common';
import { FirebaseAdminService } from '../firebase-admin/firebase-admin.service';

@Injectable()
export class FirestoreService {
  firestore: fbAdmin.firestore.Firestore;

  constructor(private fbAdminService: FirebaseAdminService) {
    this.firestore = this.fbAdminService.admin.firestore();
  }

  getRefValue = async <T>(
    ref: FirebaseFirestore.DocumentReference,
  ): Promise<T | undefined> => {
    const doc = await ref.get();
    if (doc.exists) {
      return doc.data() as T;
    }
    return;
  };

  // TRANSACTIONS_REF
  transactionsRef = () => this.firestore.collection('transactions');
  transactionsTransactionRef = (trId: string) =>
    this.firestore.collection('transactions').doc(trId);
}
