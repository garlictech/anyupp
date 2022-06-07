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

const componentDeclarations = [
  FileUploaderUIComponent,
  BannerUploadFormComponent,
  UnitBannerUIComponent,
  ButtonUIComponent,
  NotificationToggleComponent,
  ToggleButtonUiComponent,
];

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  declarations: [...componentDeclarations],
  exports: [...componentDeclarations],
})
export class AppsAdminModule {}
