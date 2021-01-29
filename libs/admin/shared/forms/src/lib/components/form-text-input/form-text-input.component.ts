import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'bgap-form-text-input',
  templateUrl: './form-text-input.component.html',
})
export class FormTextInputComponent {
  @Input() caption?: string; // Language key!!!
  @Input() staticCaption?: string; // Language key!!!
  @Input() control: FormControl;
  @Input() type: string;
  @Input() fieldSize: string;

  constructor() {
    this.fieldSize = 'small';
  }
}
