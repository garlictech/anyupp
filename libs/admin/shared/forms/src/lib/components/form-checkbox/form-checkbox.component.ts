import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'bgap-form-checkbox',
  templateUrl: './form-checkbox.component.html',
})
export class FormCheckboxComponent {
  @Input() caption?: string; // Language key!!!
  @Input() control?: FormControl;
}
