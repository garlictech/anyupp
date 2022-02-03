import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-checkbox',
  templateUrl: './form-checkbox.component.html',
})
export class FormCheckboxComponent {
  @Input() caption = ''; // Language key!!!
  @Input() control?: FormControl;
  @Input() inputId = '';
}
