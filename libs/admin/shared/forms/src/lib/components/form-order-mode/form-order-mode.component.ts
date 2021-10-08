import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as CrudApi from '@bgap/crud-gql/api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-order-mode',
  templateUrl: './form-order-mode.component.html',
})
export class FormOrderModeComponent {
  @Input() control!: FormControl;
  @Input() orderModes: CrudApi.OrderMode[] = [];

  public orderModeIsChecked(orderMode: CrudApi.OrderMode): boolean {
    return (this.control.value || []).indexOf(orderMode) >= 0;
  }

  public toggleOrderMode(orderMode: CrudApi.OrderMode): void {
    const orderModesArr = this.control.value;
    const idx = orderModesArr.indexOf(orderMode);

    if (idx < 0) {
      orderModesArr.push(orderMode);
    } else {
      orderModesArr.splice(idx, 1);
    }

    this.control.setValue(orderModesArr);
  }
}
