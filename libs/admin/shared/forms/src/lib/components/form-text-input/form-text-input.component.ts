import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbComponentSize } from '@nebular/theme';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-text-input',
  templateUrl: './form-text-input.component.html',
})
export class FormTextInputComponent {
  @Input() caption = ''; // Language key!!!
  @Input() staticCaption?: string; // Language key!!!
  @Input() control!: FormControl;
  @Input() type!: string;
  @Input() fieldSize: NbComponentSize = 'small';

  constructor() {
    this.fieldSize = 'small';
  }
}
