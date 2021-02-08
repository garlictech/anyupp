import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsDailySalesPerTypeComponent } from './reports-daily-sales-per-type.component';

xdescribe('ReportsDailySalesPerTypeComponent', () => {
  let component: ReportsDailySalesPerTypeComponent;
  let fixture: ComponentFixture<ReportsDailySalesPerTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportsDailySalesPerTypeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsDailySalesPerTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
