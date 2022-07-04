import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, UntypedFormArray } from '@angular/forms';

@Pipe({
  name: 'asFormArray',
})
export class AsFormArrayPipe implements PipeTransform {
  transform(
    control: AbstractControl | null | undefined,
  ): UntypedFormArray | undefined {
    return control ? (control as UntypedFormArray) : undefined;
  }
}
