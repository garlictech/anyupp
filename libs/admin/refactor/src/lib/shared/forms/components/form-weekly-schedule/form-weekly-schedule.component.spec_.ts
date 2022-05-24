import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormWeeklyScheduleComponent } from './form-weekly-schedule.component';

xdescribe('FormWeeklyScheduleComponent', () => {
  let component: FormWeeklyScheduleComponent;
  let fixture: ComponentFixture<FormWeeklyScheduleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormWeeklyScheduleComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormWeeklyScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
