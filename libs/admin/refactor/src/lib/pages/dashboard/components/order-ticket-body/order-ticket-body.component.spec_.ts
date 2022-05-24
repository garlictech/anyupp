import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrderTicketBodyComponent } from './order-ticket-body.component';

xdescribe('OrderTicketBodyComponent', () => {
  let component: OrderTicketBodyComponent;
  let fixture: ComponentFixture<OrderTicketBodyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OrderTicketBodyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTicketBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
