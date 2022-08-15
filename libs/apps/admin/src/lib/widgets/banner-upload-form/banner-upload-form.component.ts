import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AbsUnitBannerService, bannerType, ImageAsset } from '@bgap/domain';

import { ToggleButtonOptions } from '../../ui-widgets/toggle-button-ui/toggle-button-ui.component';
import {
  fileUploadValidator,
  FileUploadValidatorErrorTypes,
} from '../../validators/fileUploadValidator';

const MAX_NUMBER_OF_BANNERS = 5;

@Component({
  selector: 'lib-admin-banner-upload-form',
  templateUrl: './banner-upload-form.component.html',
  styleUrls: ['./banner-upload-form.component.scss'],
})
export class BannerUploadFormComponent implements OnInit {
  @Input() unitId?: string;
  @Input() imageUrlPrefix?: string;
  @Input() type: bannerType = 'ad';

  @Output() readonly operationSuccess = new EventEmitter<string>();
  @Output() readonly operationError = new EventEmitter<string>();

  bannerLimit = MAX_NUMBER_OF_BANNERS;
  validatorErrorTypes = FileUploadValidatorErrorTypes;

  currentUnitBanners: ImageAsset[] = [];
  currentAdUnitBannersEnabled = false;

  toggleOptions: ToggleButtonOptions = {
    toggledText: 'common.allowed',
    untoggledText: 'common.disallowed',
  };

  bannerUploadForm = new UntypedFormGroup({
    fileUpload: new UntypedFormControl(null, [
      Validators.required,
      fileUploadValidator({
        allowedMimePrefixes: ['image/'],
      }),
    ]),
  });

  operationsPending = {
    initializeData: false,
    toggleBanners: false,
    removeBanner: false,
    uploadBanner: false,
  };

  constructor(private _bannerService: AbsUnitBannerService) {}

  get fileUpload(): UntypedFormControl {
    return this.bannerUploadForm.get('fileUpload') as UntypedFormControl;
  }

  get operationIsPending(): boolean {
    return Object.values(this.operationsPending).some(pending => pending);
  }

  ngOnInit(): void {
    void this.initializeData();
  }

  async initializeData(): Promise<void> {
    if (this.unitId) {
      this.operationsPending.initializeData = true;

      this.currentUnitBanners = await this._bannerService.getBannersForUnit({
        unitId: this.unitId,
        type: this.type,
      });

      this.currentAdUnitBannersEnabled =
        await this._bannerService.getAdBannersEnabledStatusForUnit({
          unitId: this.unitId,
        });

      this.operationsPending.initializeData = false;
    }
  }

  async onToggleBanners() {
    if (this.unitId) {
      this.operationsPending.toggleBanners = true;

      try {
        this.currentAdUnitBannersEnabled =
          await this._bannerService.toggleAdBannersEnabledStatusForUnit({
            unitId: this.unitId,
          });

        this.operationSuccess.emit(
          `${this.type}Banners status toggled successfully`,
        );
      } catch (e) {
        console.error('error in onBannerDelete', e);
        this.operationError.emit(
          `Error while changing ${this.type} banners enabled status`,
        );
      }
      this.operationsPending.toggleBanners = false;
    }
  }

  async onRemoveBanner(bannerPath: string) {
    if (this.unitId) {
      this.operationsPending.removeBanner = true;

      try {
        this.currentUnitBanners =
          await this._bannerService.removeBannerFromUnit({
            unitId: this.unitId,
            bannerPath,
            type: this.type,
          });
        this.operationSuccess.emit(`${this.type}Banner removed successfully`);
      } catch (e) {
        console.error('error in onBannerDelete', e);
        this.operationError.emit('Error while removing banner');
      }

      this.operationsPending.removeBanner = false;
    }
  }

  async onUploadBanner() {
    if (this.unitId && this.bannerUploadForm.valid) {
      this.bannerUploadForm.disable();
      this.operationsPending.uploadBanner = true;

      try {
        this.currentUnitBanners = await this._bannerService.addNewBannerToUnit({
          unitId: this.unitId,
          bannerImage: this.fileUpload.value,
          type: this.type,
        });
        this.fileUpload.setValue(null);
        this.operationSuccess.emit('Banner added successfully');
      } catch (e) {
        console.error('error in onBannerUpload', e);
        this.operationError.emit('Error while adding banner');
      }

      this.operationsPending.uploadBanner = false;
      this.bannerUploadForm.enable();
    }
  }
}
