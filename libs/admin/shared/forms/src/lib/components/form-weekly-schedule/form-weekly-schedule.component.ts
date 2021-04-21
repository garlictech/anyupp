import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { FormsService } from '../../services/forms/forms.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-weekly-schedule',
  templateUrl: './form-weekly-schedule.component.html',
})
export class FormWeeklyScheduleComponent {
  @Input() scheduleControl!: FormControl;
  public dayKeys: string[];

  constructor(private _formsService: FormsService, private _changeDetectorRef: ChangeDetectorRef) {
    this.dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  }

  public addCustomDate(): void {
    (<FormArray>this.scheduleControl.get('custom')).push(
      this._formsService.createCustomDailyScheduleFormGroup(),
    );

    this._changeDetectorRef.detectChanges();
  }
}
