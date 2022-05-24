import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsUniqueGuestAvgSalesComponent } from './reports-unique-guest-avg-sales.component';

xdescribe('ReportsUniqueGuestAvgSalesComponent', () => {
  let component: ReportsUniqueGuestAvgSalesComponent;
  let fixture: ComponentFixture<ReportsUniqueGuestAvgSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportsUniqueGuestAvgSalesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsUniqueGuestAvgSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
