import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { NbComponentSize } from '@nebular/theme';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-textarea',
  templateUrl: './form-textarea.component.html',
})
export class FormTextAreaComponent {
  @Input() caption = ''; // Language key!!!
  @Input() staticCaption?: string; // Language key!!!
  @Input() control?: UntypedFormControl | null;
  @Input() type!: string;
  @Input() fieldSize: NbComponentSize = 'small';
  @Input() inputId = '';
  @Input() readonly = false;

  constructor() {
    this.fieldSize = 'small';
  }
}
