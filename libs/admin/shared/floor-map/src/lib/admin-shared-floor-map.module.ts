import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NbIconModule } from '@nebular/theme';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { FLOOR_MAP_FEATURE_KEY, floorMapReducer } from './+state/floor-map.reducer';
import { FloorMapEditorComponent } from './components/floor-map-editor';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(FLOOR_MAP_FEATURE_KEY, floorMapReducer),
    TranslateModule,
    ReactiveFormsModule,
    NbIconModule
  ],
  declarations: [FloorMapEditorComponent],
  exports: [FloorMapEditorComponent],
})
export class AdminSharedFloorMapModule {}
