import { IKeyValue } from '@bgap/shared/types/interfaces';

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'bgap-form-select',
  templateUrl: './form-select.component.html',
})
export class FormSelectComponent {
  @Input() caption: string; // Language key!!!
  @Input() options: IKeyValue[];
  @Input() control: FormControl;
  @Input() forceShowEmptyOption?: boolean;
  @Input() localize: boolean;
  @Input() size: string;
  @Output() selectionChange = new EventEmitter();

  constructor() {
    this.forceShowEmptyOption = false;
    this.size = 'small';
  }

  public onChange($event: Event): void {
    if (this.selectionChange) {
      this.selectionChange.emit($event);
    }
  }
}
