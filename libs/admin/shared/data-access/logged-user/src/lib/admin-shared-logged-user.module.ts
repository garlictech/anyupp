import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LoggedUserEffects } from './+state/logged-user.effects';

import {
  LOGGED_USER_FEATURE_KEY,
  loggedUserReducer,
} from './+state/logged-user.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(LOGGED_USER_FEATURE_KEY, loggedUserReducer),
    EffectsModule.forFeature([LoggedUserEffects]),
  ],
})
export class AdminSharedLoggedUserModule {}
