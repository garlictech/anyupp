import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import {
  FLOOR_MAP_FEATURE_KEY,
  floorMapReducer,
} from './+state/floor-map.reducer';
import { FloorMapEditorComponent } from './components/floor-map-editor';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(FLOOR_MAP_FEATURE_KEY, floorMapReducer),
  ],
  declarations: [FloorMapEditorComponent],
  exports: [FloorMapEditorComponent],
})
export class AdminSharedFloorMapModule {}
