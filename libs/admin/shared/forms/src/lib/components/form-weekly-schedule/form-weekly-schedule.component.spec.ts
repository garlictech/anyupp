import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormWeeklyScheduleComponent } from './form-weekly-schedule.component';

describe('FormWeeklyScheduleComponent', (): void => {
  let component: FormWeeklyScheduleComponent;
  let fixture: ComponentFixture<FormWeeklyScheduleComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [FormWeeklyScheduleComponent],
      }).compileComponents();
    })
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(FormWeeklyScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
