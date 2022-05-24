import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsHourlyBreakdownComponent } from './reports-hourly-breakdown.component';

xdescribe('ReportsHourlyBreakdownComponent', () => {
  let component: ReportsHourlyBreakdownComponent;
  let fixture: ComponentFixture<ReportsHourlyBreakdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportsHourlyBreakdownComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsHourlyBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
