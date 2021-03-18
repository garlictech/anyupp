import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTicketHistoryListComponent } from './order-ticket-history-list.component';

xdescribe('OrderTicketHistoryListComponent', (): void => {
  let component: OrderTicketHistoryListComponent;
  let fixture: ComponentFixture<OrderTicketHistoryListComponent>;

  beforeEach(
    async (): Promise<void> => {
      await TestBed.configureTestingModule({
        declarations: [OrderTicketHistoryListComponent],
      }).compileComponents();
    },
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(OrderTicketHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
