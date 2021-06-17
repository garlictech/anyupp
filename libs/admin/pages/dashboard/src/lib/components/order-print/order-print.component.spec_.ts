import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPrintComponent } from './order-print.component';

xdescribe('OrderPrintComponent', (): void => {
  let component: OrderPrintComponent;
  let fixture: ComponentFixture<OrderPrintComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [OrderPrintComponent],
    }).compileComponents();
  });

  beforeEach((): void => {
    fixture = TestBed.createComponent(OrderPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
