import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Pipe({
  name: 'iterableAbstractControls',
})
export class IterableAbstractControlsPipe implements PipeTransform {
  transform(control: AbstractControl): AbstractControl[] {
    return Object.values((control as FormGroup).controls) as AbstractControl[];
  }
}
