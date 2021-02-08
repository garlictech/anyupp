import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsOrdersAmountAvgSalesComponent } from './reports-orders-amount-avg-sales.component';

xdescribe('ReportsOrdersAmountAvgSalesComponent', () => {
  let component: ReportsOrdersAmountAvgSalesComponent;
  let fixture: ComponentFixture<ReportsOrdersAmountAvgSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportsOrdersAmountAvgSalesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsOrdersAmountAvgSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
