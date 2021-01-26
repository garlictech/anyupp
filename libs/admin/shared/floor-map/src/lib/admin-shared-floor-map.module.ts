import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FloorMapEditorComponent } from './components/floor-map-editor';

@NgModule({
  imports: [CommonModule],
  declarations: [FloorMapEditorComponent],
  exports: [FloorMapEditorComponent]
})
export class AdminSharedFloorMapModule {}
