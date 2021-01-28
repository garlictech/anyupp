import * as fbAdmin from 'firebase-admin';

import { Injectable } from '@nestjs/common';
import { FirebaseAdminService } from '../firebase-admin/firebase-admin.service';

@Injectable()
export class DatabaseService {
  database: fbAdmin.database.Database;

  constructor(private fbAdminService: FirebaseAdminService) {
    this.database = this.fbAdminService.admin.database();
  }

  getRefValue = async <T>(
    ref: fbAdmin.database.Reference | fbAdmin.database.Query
  ): Promise<T> => await (await ref.once('value')).val();

  // ADMIN_USER
  adminUsersRef = () => this.database.ref('adminUsers');
  adminUserRef = (id: string) => this.adminUsersRef().child(id);
  adminUserRolesRef = (userId: string) =>
    this.adminUserRef(userId).child('roles');

  // USER
  userRef = (userId: string) => this.database.ref(`users/${userId}`);

  // ORDERS
  ordersChainsRef = () => this.database.ref(`orders/chains`);
  ordersUnitRef = ({ chainId, unitId }: { chainId: string; unitId: string }) =>
    this.ordersChainsRef().child(`${chainId}/units/${unitId}`);
  ordersActiveRef = ({
    chainId,
    unitId,
  }: {
    chainId: string;
    unitId: string;
  }) => this.ordersUnitRef({ chainId, unitId }).child(`active`);
  ordersUsersActiveRef = ({
    chainId,
    unitId,
    userId,
  }: {
    chainId: string;
    unitId: string;
    userId: string;
  }) =>
    this.ordersActiveRef({ chainId, unitId })
      .orderByChild('userId')
      .equalTo(userId);
}
