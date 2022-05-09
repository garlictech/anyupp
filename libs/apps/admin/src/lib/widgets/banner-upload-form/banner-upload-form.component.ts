import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  fileUploadValidator,
  FileUploadValidatorErrorTypes,
} from '../../validators/fileUploadValidator';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AbsUnitAdBannerService, AdBanner } from '@bgap/domain';

const MAX_NUMBER_OF_BANNERS = 5;

@Component({
  selector: 'lib-admin-banner-upload-form',
  templateUrl: './banner-upload-form.component.html',
  styleUrls: ['./banner-upload-form.component.scss'],
})
export class BannerUploadFormComponent implements OnInit {
  @Input() unitId?: string;
  @Input() imageUrlPrefix?: string;

  @Output() readonly operationSuccess = new EventEmitter<string>();
  @Output() readonly operationError = new EventEmitter<string>();

  validatorErrorTypes = FileUploadValidatorErrorTypes;
  currentUnitBanners: AdBanner[] = [];
  currentUnitBannersEnabled = false;
  bannerUploadForm = new FormGroup({
    fileUpload: new FormControl(null, [
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

  constructor(private bannerService: AbsUnitAdBannerService) {}

  get fileUpload(): FormControl {
    return this.bannerUploadForm.get('fileUpload') as FormControl;
  }

  get operationIsPending(): boolean {
    return Object.values(this.operationsPending).some(pending => pending);
  }

  get bannerUploadEnabled(): boolean {
    return this.currentUnitBanners.length < MAX_NUMBER_OF_BANNERS;
  }

  ngOnInit(): void {
    void this.initializeData();
  }

  async initializeData(): Promise<void> {
    if (this.unitId) {
      this.operationsPending.initializeData = true;

      this.currentUnitBanners = await this.bannerService.getAdBannersForUnit({
        unitId: this.unitId,
      });

      this.currentUnitBannersEnabled =
        await this.bannerService.getAdBannersEnabledStatusForUnit({
          unitId: this.unitId,
        });

      this.operationsPending.initializeData = false;
    }
  }

  async onToggleBanners() {
    if (this.unitId) {
      this.operationsPending.toggleBanners = true;

      try {
        this.currentUnitBannersEnabled =
          await this.bannerService.toggleAdBannersEnabledStatusForUnit({
            unitId: this.unitId,
          });

        this.operationSuccess.emit('Banners status toggled successfully');
      } catch (e) {
        console.error('error in onBannerDelete', e);
        this.operationError.emit('Error while changing banners enabled status');
      }
      this.operationsPending.toggleBanners = false;
    }
  }

  async onRemoveBanner(bannerPath: string) {
    if (this.unitId) {
      this.operationsPending.removeBanner = true;

      try {
        this.currentUnitBanners =
          await this.bannerService.removeAdBannerFromUnit({
            unitId: this.unitId,
            bannerPath,
          });
        this.operationSuccess.emit('Banner removed successfully');
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
        this.currentUnitBanners = await this.bannerService.addNewAdBannerToUnit(
          {
            unitId: this.unitId,
            bannerImage: this.fileUpload.value,
          },
        );
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
