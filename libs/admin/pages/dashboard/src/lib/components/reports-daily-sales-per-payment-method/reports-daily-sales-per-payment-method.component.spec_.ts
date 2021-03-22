import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsDailySalesPerPaymentMethodComponent } from './reports-daily-sales-per-payment-method.component';

xdescribe('ReportsDailySalesPerPaymentMethodComponent', () => {
  let component: ReportsDailySalesPerPaymentMethodComponent;
  let fixture: ComponentFixture<ReportsDailySalesPerPaymentMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportsDailySalesPerPaymentMethodComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ReportsDailySalesPerPaymentMethodComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
