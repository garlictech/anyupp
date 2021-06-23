import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTicketListComponent } from './order-ticket-list.component';

xdescribe('OrderTicketListComponent', (): void => {
  let component: OrderTicketListComponent;
  let fixture: ComponentFixture<OrderTicketListComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [OrderTicketListComponent],
    }).compileComponents();
  });

  beforeEach((): void => {
    fixture = TestBed.createComponent(OrderTicketListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
