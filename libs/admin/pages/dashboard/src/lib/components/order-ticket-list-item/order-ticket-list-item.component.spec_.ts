import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrderTicketListItemComponent } from './order-ticket-list-item.component';

xdescribe('OrderTicketListItemComponent', (): void => {
  let component: OrderTicketListItemComponent;
  let fixture: ComponentFixture<OrderTicketListItemComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [OrderTicketListItemComponent],
      }).compileComponents();
    })
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(OrderTicketListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
