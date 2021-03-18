import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrderTicketBodyComponent } from './order-ticket-body.component';

xdescribe('OrderTicketBodyComponent', (): void => {
  let component: OrderTicketBodyComponent;
  let fixture: ComponentFixture<OrderTicketBodyComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [OrderTicketBodyComponent],
      }).compileComponents();
    }),
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(OrderTicketBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
