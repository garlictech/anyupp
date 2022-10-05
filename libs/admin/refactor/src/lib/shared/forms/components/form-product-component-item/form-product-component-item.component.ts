import { Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  // changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-product-component-item',
  templateUrl: './form-product-component-item.component.html',
})
export class FormProductComponentItemComponent {
  @Input() itemFormArray?: FormArray;
  @Input() currency?: string;
}
