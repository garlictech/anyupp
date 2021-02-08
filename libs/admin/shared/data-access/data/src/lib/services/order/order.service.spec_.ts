import { TestBed } from '@angular/core/testing';

import { OrderService } from './order.service';

xdescribe('OrderService', (): void => {
  let service: OrderService;

  beforeEach((): void => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderService);
  });

  it('should be created', (): void => {
    expect(service).toBeTruthy();
  });
});
