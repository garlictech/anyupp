import * as fbAdmin from 'firebase-admin';

import { Injectable } from '@nestjs/common';
import { FirebaseAdminService } from '../firebase-admin/firebase-admin.service';

@Injectable()
export class AuthService {
  auth: fbAdmin.auth.Auth;

  constructor(private fbAdminService: FirebaseAdminService) {
    this.auth = this.fbAdminService.admin.auth();
  }
}
