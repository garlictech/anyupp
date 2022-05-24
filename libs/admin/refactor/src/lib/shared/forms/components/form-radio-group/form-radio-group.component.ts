import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { KeyValue } from '@bgap/shared/types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-radio-group',
  templateUrl: './form-radio-group.component.html',
})
export class FormRadioGroupComponent {
  @Input() caption = ''; // Language key!!!
  @Input() options: KeyValue[] = [];
  @Input() control?: FormControl | null;
  @Input() localize?: boolean;
  @Input() horizontal? = true;
  @Input() inputId = '';
}
