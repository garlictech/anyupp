import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ChainsEffects } from './+state/chains.effect';
import { CHAINS_FEATURE_KEY, chainsReducer } from './+state/chains.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(CHAINS_FEATURE_KEY, chainsReducer),
    EffectsModule.forFeature([ChainsEffects]),
  ],
})
export class AdminSharedChainsModule {}
