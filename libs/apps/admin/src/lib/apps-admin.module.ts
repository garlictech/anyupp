import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderUIComponent } from './ui-widgets/file-uploader-ui/file-uploader-ui.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BannerUploadFormComponent } from './widgets/banner-upload-form/banner-upload-form.component';
import { UnitBannerUIComponent } from './ui-widgets/unit-banner-ui/unit-banner-ui.component';
import { ButtonUIComponent } from './ui-widgets/button-ui/button-ui.component';

const componentDeclarations = [
  FileUploaderUIComponent,
  BannerUploadFormComponent,
  UnitBannerUIComponent,
  ButtonUIComponent,
];

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [...componentDeclarations],
  exports: [...componentDeclarations],
})
export class AppsAdminModule {}
