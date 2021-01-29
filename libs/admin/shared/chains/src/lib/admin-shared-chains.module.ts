import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { chainsReducer, CHAINS_FEATURE_KEY } from './+state/chains.reducer';

@NgModule({
  imports: [CommonModule, StoreModule.forFeature(CHAINS_FEATURE_KEY, chainsReducer)],
})
export class AdminSharedChainsModule {}
