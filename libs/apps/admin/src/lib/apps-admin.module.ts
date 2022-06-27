import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderUIComponent } from './ui-widgets/file-uploader-ui/file-uploader-ui.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BannerUploadFormComponent } from './widgets/banner-upload-form/banner-upload-form.component';
import { UnitBannerUIComponent } from './ui-widgets/unit-banner-ui/unit-banner-ui.component';
import { ButtonUIComponent } from './ui-widgets/button-ui/button-ui.component';
import { NotificationToggleComponent } from './widgets/notification-toggle/notification-toggle.component';
import { ToggleButtonUiComponent } from './ui-widgets/toggle-button-ui/toggle-button-ui.component';
import { TranslateModule } from '@ngx-translate/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DragNDropNestedListComponent } from './widgets/drag-n-drop-nested-list/drag-n-drop-nested-list.component';

const componentDeclarations = [
  FileUploaderUIComponent,
  BannerUploadFormComponent,
  UnitBannerUIComponent,
  ButtonUIComponent,
  NotificationToggleComponent,
  ToggleButtonUiComponent,
  DragNDropNestedListComponent,
];

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, DragDropModule],
  declarations: [...componentDeclarations],
  exports: [...componentDeclarations],
})
export class AppsAdminModule {}
