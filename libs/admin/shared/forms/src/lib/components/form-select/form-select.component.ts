import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IKeyValue } from '@bgap/shared/types';
import { NbComponentSize } from '@nebular/theme';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-select',
  templateUrl: './form-select.component.html',
})
export class FormSelectComponent {
  @Input() caption = ''; // Language key!!!
  @Input() options: IKeyValue[] = [];
  @Input() control!: FormControl;
  @Input() forceShowEmptyOption?: boolean;
  @Input() localize?: boolean;
  @Input() size: NbComponentSize = 'small';
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
