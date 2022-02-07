import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { USERS_FEATURE_KEY, usersReducer } from './+state/users.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(USERS_FEATURE_KEY, usersReducer),
  ],
})
export class AdminSharedUsersModule {}
