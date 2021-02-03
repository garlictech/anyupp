import { ImageCompressorService } from '@bgap/admin/shared/utils';
import { StorageService } from '@bgap/admin/shared/data-access/storage';

import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { EImageType } from '@bgap/shared/types';

@Component({
  selector: 'bgap-form-clickable-image-input',
  templateUrl: './form-clickable-image-input.component.html',
  styleUrls: ['./form-clickable-image-input.component.scss'],
})
export class FormClickableImageInputComponent {
  @Input() caption: string = ''; // Language key!!!
  @Input() imagePath?: string;
  @Input() maxSize: number = 400;
  @Input() imageType: EImageType = EImageType.JPEG;
  @Input() uploadFolderPath?: string;

  @Input() uploadCallbackFn!: (imagePath: string, key: string) => void;
  @Input() removeCallbackFn!: (key: string) => void;
  @Input() callbackParam: string = '';

  @Input() width: string = '';
  @Input() height: string = '';
  @Input() borderRadius?: string;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private _storageService: StorageService,
    private _imageCompressorService: ImageCompressorService
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

  public fileInputListener($event: any): void {
    const file = $event.target!.files[0];

    if (file) {
      if (file.type === 'image/svg+xml') {
        this._uploadFile(file);
      } else {
        this._imageCompressorService
          .compress(file, this.imageType!, this.maxSize)
          .subscribe(
            (_file): void => {
              this._uploadFile(_file);
            },
            (err): void => {
              console.error('Compress error', err);
            }
          );
      }
    }
  }

  private _uploadFile(file: File): void {
    this._storageService.uploadFile(this.uploadFolderPath!, file).then(
      (filePath: string): void => {
        this.imagePath = filePath;
        this.uploadCallbackFn!(this.imagePath!, this.callbackParam!);
      },
      (err): void => {
        console.error('FILE UPLOAD ERROR', err);
      }
    );
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
        }
      );
    }
  }
}
