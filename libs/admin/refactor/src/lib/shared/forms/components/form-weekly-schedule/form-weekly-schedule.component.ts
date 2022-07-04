import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { UntypedFormArray, UntypedFormControl } from '@angular/forms';

import { FormsService } from '../../services/forms/forms.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-weekly-schedule',
  templateUrl: './form-weekly-schedule.component.html',
})
export class FormWeeklyScheduleComponent {
  @Input() scheduleControl?: UntypedFormControl | null;
  public dayKeys: string[];

  constructor(
    private _formsService: FormsService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  }

  public addCustomDate() {
    (<UntypedFormArray>this.scheduleControl?.get('custom')).push(
      this._formsService.createCustomDailyScheduleFormGroup(),
    );

    this._changeDetectorRef.detectChanges();
  }

  public removeCustomDate(idx: number) {
    (<UntypedFormArray>this.scheduleControl?.get('custom')).removeAt(idx);
  }
}
