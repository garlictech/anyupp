import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { FirebaseAdminService } from '../firebase-admin/firebase-admin.service';
import { AuthService } from '../auth/auth.service';
import { FirestoreService } from '../database/firestore.service';

@Module({
  controllers: [],
  providers: [
    FirebaseAdminService,
    DatabaseService,
    FirestoreService,
    AuthService,
  ],
  exports: [DatabaseService, FirestoreService, AuthService],
})
export class ApiDataAccessModule {}
