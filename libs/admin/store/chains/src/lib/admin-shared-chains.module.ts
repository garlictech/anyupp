import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { CHAINS_FEATURE_KEY, chainsReducer } from './+state/chains.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(CHAINS_FEATURE_KEY, chainsReducer),
  ],
})
export class AdminSharedChainsModule {}
