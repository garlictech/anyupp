import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as CrudApi from '@bgap/crud-gql/api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-serving-mode',
  templateUrl: './form-serving-mode.component.html',
})
export class FormServingModeComponent {
  @Input() control?: FormControl | null;
  @Input() servingModes: CrudApi.ServingMode[] = [];

  public servingModeIsChecked(servingMode: CrudApi.ServingMode): boolean {
    return (this.control?.value || []).indexOf(servingMode) >= 0;
  }

  public toggleServingMode = (servingMode: CrudApi.ServingMode) => {
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
