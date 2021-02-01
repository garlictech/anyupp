import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { groupsReducer, GROUPS_FEATURE_KEY } from './+state/groups.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(GROUPS_FEATURE_KEY, groupsReducer),
  ],
})
export class AdminSharedGroupsModule {}
