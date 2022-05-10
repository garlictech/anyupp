import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { StorageService } from '@bgap/admin/shared/data-access/storage';
import { ImageCompressorService } from '@bgap/admin/shared/utils';
import { EImageType } from '@bgap/shared/types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-clickable-image-input',
  templateUrl: './form-clickable-image-input.component.html',
  styleUrls: ['./form-clickable-image-input.component.scss'],
})
export class FormClickableImageInputComponent {
  @Input() caption = ''; // Language key!!!
  @Input() image?: string | null;
  @Input() maxSize = 400;
  @Input() uploadFolderPath?: string;

  @Input() uploadCallbackFn?: (imageKey: string, param: string) => void;
  @Input() removeCallbackFn?: (param: string) => void;
  @Input() callbackParam = '';

  @Input() width = '';
  @Input() height = '';
  @Input() borderRadius?: string;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private _storageService: StorageService,
    private _imageCompressorService: ImageCompressorService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.caption = '';
  }

  loadImage(): void {
    if (!this.image) {
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
          .compress(
            file,
            file.type === 'image/png' ? EImageType.PNG : EImageType.JPEG,
            this.maxSize,
          )
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
    this._storageService
      .uploadFile(this.uploadFolderPath || '', file)
      .then((imageKey: string) => {
        this.image = imageKey;

        if (this.uploadCallbackFn) {
          this.uploadCallbackFn(imageKey, this.callbackParam);
        }

        this._changeDetectorRef.detectChanges();
      });
  }

  public remove(): void {
    if (this.image) {
      this._storageService.removeFile(this.image).then(
        (): void => {
          this.image = undefined;

          this._changeDetectorRef.detectChanges();

          if (this.removeCallbackFn) {
            this.removeCallbackFn(this.callbackParam);
          }
        },
        (): void => {
          if (this.removeCallbackFn) {
            this.removeCallbackFn(this.callbackParam);
          }
        },
      );
    }
  }
}
