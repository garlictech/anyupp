import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import {
  LOGGED_USER_FEATURE_KEY,
  loggedUserReducer,
} from './+state/logged-user.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(LOGGED_USER_FEATURE_KEY, loggedUserReducer),
  ],
})
export class AdminSharedLoggedUserModule {}
