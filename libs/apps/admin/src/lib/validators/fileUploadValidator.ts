import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const MAX_FILE_SIZE_BYTES = 1024 * 1024 * 5; // 5MB

export enum FileUploadValidatorErrorTypes {
  fileSize = 'fileSize',
  fileType = 'fileType',
}

export interface ValidatorParams {
  allowedMimePrefixes: string[];
}

export const fileUploadValidator =
  ({ allowedMimePrefixes }: ValidatorParams): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null =>
    validateFile(control.value as File | null, allowedMimePrefixes);

const validateFile = (
  file: File | null,
  allowedMimePrefixes: string[],
): ValidationErrors | null => {
  const validationErrors: ValidationErrors = {};

  if (!file) {
    return null;
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    validationErrors[FileUploadValidatorErrorTypes.fileSize] =
      'File is larger than allowed';
  }

  if (!allowedMimePrefixes.some(prefix => file?.type.startsWith(prefix))) {
    validationErrors[FileUploadValidatorErrorTypes.fileType] =
      'File type is not allowed';
  }

  return validationErrors === {} ? null : validationErrors;
};
