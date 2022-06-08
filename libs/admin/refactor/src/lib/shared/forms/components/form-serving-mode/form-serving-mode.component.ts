import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ServingMode } from '@bgap/domain';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-serving-mode',
  templateUrl: './form-serving-mode.component.html',
})
export class FormServingModeComponent {
  @Input() control?: FormControl | null;
  @Input() servingModes: ServingMode[] = [];

  public servingModeIsChecked(servingMode: ServingMode): boolean {
    return (this.control?.value || []).indexOf(servingMode) >= 0;
  }

  public toggleServingMode = (servingMode: ServingMode) => {
    const servingModesArr = this.control?.value;
    const idx = servingModesArr.indexOf(servingMode);

    if (idx < 0) {
      servingModesArr.push(servingMode);
    } else {
      servingModesArr.splice(idx, 1);
    }

    this.control?.setValue(servingModesArr);
  };
}
