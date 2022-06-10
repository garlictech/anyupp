import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
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
  @Input() prefix?: string;
  @Input() suffix?: string;
  @Input() control?: FormControl | null;
  @Input() type!: string;
  @Input() fieldSize: NbComponentSize = 'small';
  @Input() inputId = '';
  @Input() readonly = false;
  @Output() inputChange = new EventEmitter();

  constructor() {
    this.fieldSize = 'small';
  }

  public onInput() {
    this.inputChange.emit(this.control?.value);
  }
}
