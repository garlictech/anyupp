import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTicketHistoryListComponent } from './order-ticket-history-list.component';

xdescribe('OrderTicketHistoryListComponent', () => {
  let component: OrderTicketHistoryListComponent;
  let fixture: ComponentFixture<OrderTicketHistoryListComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [OrderTicketHistoryListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTicketHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
