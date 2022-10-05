import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';

@Pipe({
  name: 'asFormArray',
})
export class AsFormArrayPipe implements PipeTransform {
  transform(
    control: AbstractControl | null | undefined,
  ): FormArray | undefined {
    return control ? (control as FormArray) : undefined;
  }
}
