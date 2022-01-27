import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { KeyValue } from '@bgap/shared/types';
import { NbComponentSize } from '@nebular/theme';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-select',
  templateUrl: './form-select.component.html',
})
export class FormSelectComponent {
  @Input() caption = ''; // Language key!!!
  @Input() options: KeyValue[] = [];
  @Input() control?: FormControl | null;
  @Input() forceShowEmptyOption?: boolean;
  @Input() localize?: boolean;
  @Input() size: NbComponentSize = 'small';
  @Input() inputId = '';
  @Output() selectionChange = new EventEmitter();

  constructor(private _changeDetectorRef: ChangeDetectorRef) {
    this.forceShowEmptyOption = false;
    this.size = 'small';
  }

  public onChange($event: Event): void {
    if (this.selectionChange) {
      this.selectionChange.emit($event);

      this._changeDetectorRef.detectChanges();
    }
  }
}
