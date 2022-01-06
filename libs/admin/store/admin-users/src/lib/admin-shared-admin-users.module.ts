import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import {
  ADMIN_USERS_FEATURE_KEY,
  adminUsersReducer,
} from './+state/admin-users.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(ADMIN_USERS_FEATURE_KEY, adminUsersReducer),
  ],
})
export class AdminSharedAdminUsersModule {}
