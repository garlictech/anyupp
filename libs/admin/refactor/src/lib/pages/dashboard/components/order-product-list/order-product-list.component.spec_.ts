import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrderProductListComponent } from './order-product-list.component';

xdescribe('OrderProductListComponent', () => {
  let component: OrderProductListComponent;
  let fixture: ComponentFixture<OrderProductListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OrderProductListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
