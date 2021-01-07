import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPrintComponent } from './order-print.component';

describe('OrderPrintComponent', (): void => {
  let component: OrderPrintComponent;
  let fixture: ComponentFixture<OrderPrintComponent>;

  beforeEach(
    async (): Promise<any> => {
      await TestBed.configureTestingModule({
        declarations: [OrderPrintComponent],
      }).compileComponents();
    }
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(OrderPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
