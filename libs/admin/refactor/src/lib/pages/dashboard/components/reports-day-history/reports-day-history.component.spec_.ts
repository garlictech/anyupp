import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsDayHistoryComponent } from './reports-day-history.component';

xdescribe('ReportsDayHistoryComponent', () => {
  let component: ReportsDayHistoryComponent;
  let fixture: ComponentFixture<ReportsDayHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportsDayHistoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsDayHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
