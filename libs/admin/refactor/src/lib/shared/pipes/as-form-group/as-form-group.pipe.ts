import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Pipe({
  name: 'asFormGroup',
})
export class AsFormGroupPipe implements PipeTransform {
  transform(
    control: AbstractControl | null | undefined,
  ): FormGroup | undefined {
    return control ? (control as FormGroup) : undefined;
  }
}
