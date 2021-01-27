import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { FirebaseAdminService } from '../firebase-admin/firebase-admin.service';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [],
  providers: [FirebaseAdminService, DatabaseService, AuthService],
  exports: [DatabaseService, AuthService],
})
export class ApiDataAccessModule {}
