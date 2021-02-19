import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrderDetailsComponent } from './order-details.component';

xdescribe('OrderDetailsComponent', (): void => {
  let component: OrderDetailsComponent;
  let fixture: ComponentFixture<OrderDetailsComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [OrderDetailsComponent],
      }).compileComponents();
    }),
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(OrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
