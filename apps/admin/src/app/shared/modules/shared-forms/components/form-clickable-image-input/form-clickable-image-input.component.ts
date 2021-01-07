import { ImageCompressorService } from 'src/app/shared/services/image-compressor';
import { StorageService } from 'src/app/shared/services/storage';

import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { EImageType } from 'src/app/shared/enums';

@Component({
  selector: 'app-form-clickable-image-input',
  templateUrl: './form-clickable-image-input.component.html',
  styleUrls: ['./form-clickable-image-input.component.scss'],
})
export class FormClickableImageInputComponent {
  @Input() caption?: string; // Language key!!!
  @Input() imagePath: string;
  @Input() maxSize: number;
  @Input() imageType: EImageType;
  @Input() uploadFolderPath: string;

  @Input() uploadCallbackFn: any;
  @Input() removeCallbackFn: any;
  @Input() callbackParam: any;

  @Input() width: number;
  @Input() height: number;
  @Input() borderRadius: string;

  @ViewChild('fileInput') fileInput: ElementRef;

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
    const file = $event.target.files[0];

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
            }
          );
      }
    }
  }

  private _uploadFile(file: File): void {
    this._storageService.uploadFile(this.uploadFolderPath, file).then(
      (filePath: string): void => {
        this.imagePath = filePath;
        this.uploadCallbackFn(this.imagePath, this.callbackParam);
      },
      (err): void => {
        console.error('FILE UPLOAD ERROR', err);
      }
    );
  }

  public remove(): void {
    if (this.imagePath) {
      this._storageService.removeFile(this.imagePath).then(
        (d): void => {
          delete this.imagePath;
          this.removeCallbackFn(this.callbackParam);
        },
        (err): void => {
          this.removeCallbackFn(this.callbackParam);
        }
      );
    }
  }
}
