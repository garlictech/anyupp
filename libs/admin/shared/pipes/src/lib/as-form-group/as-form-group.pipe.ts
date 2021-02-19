import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Pipe({
  name: 'asFormGroup',
})
export class AsFormGroupPipe implements PipeTransform {
  transform(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }
}
