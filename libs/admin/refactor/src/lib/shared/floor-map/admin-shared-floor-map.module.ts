import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminSharedPipesModule } from '../../shared/pipes';

import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import {
  NbButtonModule,
  NbCheckboxModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
} from '@nebular/theme';
import {
  FLOOR_MAP_FEATURE_KEY,
  floorMapReducer,
} from './+state/floor-map.reducer';
import { FloorMapEditorComponent } from './components/floor-map-editor';
import { NbEvaIconsModule } from '@nebular/eva-icons';
const NB_MODULES = [
  NbIconModule,
  NbInputModule,
  NbButtonModule,
  NbLayoutModule,

  NbIconModule,
  NbInputModule,
  NbEvaIconsModule,
  NbButtonModule,

  NbCheckboxModule,
];

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(FLOOR_MAP_FEATURE_KEY, floorMapReducer),
    TranslateModule,
    ReactiveFormsModule,
    NbIconModule,
    AdminSharedPipesModule,
    ...NB_MODULES,
  ],
  declarations: [FloorMapEditorComponent],
  exports: [FloorMapEditorComponent],
})
export class AdminSharedFloorMapModule {}
