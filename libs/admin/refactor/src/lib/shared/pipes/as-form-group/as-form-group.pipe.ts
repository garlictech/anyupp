import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';

@Pipe({
  name: 'asFormGroup',
})
export class AsFormGroupPipe implements PipeTransform {
  transform(
    control: AbstractControl | null | undefined,
  ): UntypedFormGroup | undefined {
    return control ? (control as UntypedFormGroup) : undefined;
  }
}
