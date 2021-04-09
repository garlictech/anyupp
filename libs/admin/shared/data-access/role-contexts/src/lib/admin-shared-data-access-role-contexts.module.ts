import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import {
  ROLE_CONTEXTS_FEATURE_KEY,
  roleContextsReducer,
} from './+state/role-contexts.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(ROLE_CONTEXTS_FEATURE_KEY, roleContextsReducer),
  ],
})
export class AdminSharedRoleContextsModule {}
