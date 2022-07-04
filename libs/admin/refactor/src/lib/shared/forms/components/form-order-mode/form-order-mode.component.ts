import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { OrderMode } from '@bgap/domain';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-order-mode',
  templateUrl: './form-order-mode.component.html',
})
export class FormOrderModeComponent {
  @Input() control?: UntypedFormControl | null;
  @Input() orderModes: OrderMode[] = [];

  public orderModeIsChecked(orderMode: OrderMode): boolean {
    return (this.control?.value || []).indexOf(orderMode) >= 0;
  }

  public toggleOrderMode(orderMode: OrderMode) {
    const orderModesArr = this.control?.value;
    const idx = orderModesArr.indexOf(orderMode);

    if (idx < 0) {
      orderModesArr.push(orderMode);
    } else {
      orderModesArr.splice(idx, 1);
    }

    this.control?.setValue(orderModesArr);
  }
}
