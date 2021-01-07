import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-checkbox',
  templateUrl: './form-checkbox.component.html',
})
export class FormCheckboxComponent {
  @Input() caption: string; // Language key!!!
  @Input() control: FormControl;
}
