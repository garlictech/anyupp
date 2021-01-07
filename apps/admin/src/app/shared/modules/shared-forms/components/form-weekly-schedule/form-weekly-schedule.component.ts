import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormsService } from 'src/app/shared/services/forms';

@Component({
  selector: 'app-form-weekly-schedule',
  templateUrl: './form-weekly-schedule.component.html',
})
export class FormWeeklyScheduleComponent implements OnInit {
  @Input() scheduleControl: FormControl;
  public dayKeys: string[];

  constructor(private _formsService: FormsService) {
    this.dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  }

  ngOnInit(): void {}

  public addCustomDate(): void {
    this.scheduleControl['controls'].override.push(
      this._formsService.createCustomDailyScheduleFormGroup()
    );
  }
}
