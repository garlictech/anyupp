import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Pipe({
  name: 'asFormControl',
})
export class AsFormControlPipe implements PipeTransform {
  transform(
    control: AbstractControl | null | undefined,
  ): FormControl | undefined {
    return control ? (control as FormControl) : undefined;
  }
}
