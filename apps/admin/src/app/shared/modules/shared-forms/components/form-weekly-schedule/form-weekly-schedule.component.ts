import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormsService } from '../../../../services/forms';

@Component({
  selector: 'bgap-form-weekly-schedule',
  templateUrl: './form-weekly-schedule.component.html',
})
export class FormWeeklyScheduleComponent implements OnInit {
  @Input() scheduleControl: FormControl;
  public dayKeys: string[];

  constructor(private _formsService: FormsService) {
    this.dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  }

  public addCustomDate(): void {
    this.scheduleControl['controls'].override.push(
      this._formsService.createCustomDailyScheduleFormGroup()
    );
  }
}
