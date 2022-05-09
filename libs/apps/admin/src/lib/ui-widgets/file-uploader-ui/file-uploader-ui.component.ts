import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'lib-admin-file-uploader-ui',
  templateUrl: './file-uploader-ui.component.html',
  styleUrls: ['./file-uploader-ui.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploaderUIComponent,
      multi: true,
    },
  ],
})
export class FileUploaderUIComponent implements ControlValueAccessor {
  @ViewChild('fileInput', { static: true })
  fileInput!: ElementRef<HTMLInputElement>;

  fileToUpload: File | null = null;
  disabled = false;

  @HostListener('change', ['$event.target.files'])
  emitFiles(files: FileList): void {
    if (files) {
      this.fileToUpload = files.item(0);
      this.onChange(this.fileToUpload);
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(): void {
    this.onTouched();
  }

  registerOnChange(fn: (_: File | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: never): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // We are not interested in the written value, we just reset the input
  writeValue(): void {
    this.fileInput.nativeElement.value = '';
    this.fileToUpload = null;
  }

  private onChange: (_: File | null) => void = () => {
    console.log('dummy onChange');
  };

  private onTouched: () => void = () => {
    console.log('dummy onTouched');
  };
}
