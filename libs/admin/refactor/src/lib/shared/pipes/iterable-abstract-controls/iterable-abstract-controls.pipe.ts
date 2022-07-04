import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, UntypedFormArray } from '@angular/forms';

@Pipe({
  name: 'iterableAbstractControls',
})
export class IterableAbstractControlsPipe implements PipeTransform {
  transform(control: AbstractControl): AbstractControl[] {
    return (control as UntypedFormArray).controls as AbstractControl[];
  }
}
