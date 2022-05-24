import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrderTicketListItemComponent } from './order-ticket-list-item.component';

xdescribe('OrderTicketListItemComponent', () => {
  let component: OrderTicketListItemComponent;
  let fixture: ComponentFixture<OrderTicketListItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OrderTicketListItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTicketListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
