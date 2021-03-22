import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';

@Pipe({
  name: 'iterableAbstractControls',
})
export class IterableAbstractControlsPipe implements PipeTransform {
  transform(control: AbstractControl): AbstractControl[] {
    return (control as FormArray).controls as AbstractControl[];
  }
}
