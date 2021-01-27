import * as fbAdmin from 'firebase-admin';

import { Injectable } from '@nestjs/common';
import { FirebaseAdminService } from '../firebase-admin/firebase-admin.service';

@Injectable()
export class DatabaseService {
  database: fbAdmin.database.Database;

  constructor(private fbAdminService: FirebaseAdminService) {
    this.database = this.fbAdminService.admin.database();
  }

  adminUsersRef = () => this.database.ref('adminUsers');
  adminUserRef = (id: string) => this.adminUsersRef().child(id);
}
