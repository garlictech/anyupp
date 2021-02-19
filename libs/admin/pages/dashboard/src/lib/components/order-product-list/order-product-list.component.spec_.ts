import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrderProductListComponent } from './order-product-list.component';

xdescribe('OrderProductListComponent', (): void => {
  let component: OrderProductListComponent;
  let fixture: ComponentFixture<OrderProductListComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [OrderProductListComponent],
      }).compileComponents();
    }),
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(OrderProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
