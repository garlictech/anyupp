import { ImageCompressorService } from '@bgap/admin/shared/utils';
import { StorageService } from '@bgap/admin/shared/data-access/storage';
import { AmplifyService } from 'aws-amplify-angular';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { EImageType } from '@bgap/shared/types';

interface IStorageResponse {
  key: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-clickable-image-input',
  templateUrl: './form-clickable-image-input.component.html',
  styleUrls: ['./form-clickable-image-input.component.scss'],
})
export class FormClickableImageInputComponent {
  @Input() caption = ''; // Language key!!!
  @Input() imagePath?: string;
  @Input() maxSize = 400;
  @Input() imageType: EImageType = EImageType.JPEG;
  @Input() uploadFolderPath?: string;

  @Input() uploadCallbackFn!: (imagePath: string, key: string) => void;
  @Input() removeCallbackFn!: (key: string) => void;
  @Input() callbackParam = '';

  @Input() width = '';
  @Input() height = '';
  @Input() borderRadius?: string;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private _amplifyService: AmplifyService,
    private _storageService: StorageService,
    private _imageCompressorService: ImageCompressorService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.caption = '';
  }

  get pathUrl(): string {
    return `url("${this.imagePath || '#fff'}")`;
  }

  loadImage(): void {
    if (!this.imagePath) {
      this.fileInput.nativeElement.click();
    }
  }

  public fileInputListener($event: Event): void {
    const target = $event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    if (file) {
      if (file.type === 'image/svg+xml') {
        this._uploadFile(file);
      } else {
        this._imageCompressorService
          .compress(file, this.imageType, this.maxSize)
          .subscribe(
            (_file): void => {
              this._uploadFile(_file);
            },
            (err): void => {
              console.error('Compress error', err);
            },
          );
      }
    }
  }

  private _uploadFile(file: File): void {
    const key = `${this.uploadFolderPath || ''}/${file.name}`;

    this._amplifyService.storage().put(key, file, {
      level: 'public',
      contentType: file.type
    }).then((success: IStorageResponse) => {
      console.error('success', success);
      this._amplifyService.storage().get(success.key).then((filePath: string) => {
        this.imagePath = filePath;
        // this.uploadCallbackFn(success.key, this.callbackParam);
        this.uploadCallbackFn(filePath, this.callbackParam);

        this._changeDetectorRef.detectChanges();
      });
    }).catch((error: unknown) => {
      console.error('Upload error', error);
    });
  }

  public remove(): void {
    if (this.imagePath) {
      this._storageService.removeFile(this.imagePath).then(
        (): void => {
          this.imagePath = undefined;
          this.removeCallbackFn(this.callbackParam);
        },
        (): void => {
          this.removeCallbackFn(this.callbackParam);
        },
      );
    }
  }
}
