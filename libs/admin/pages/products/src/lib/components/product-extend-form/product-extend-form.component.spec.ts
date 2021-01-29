import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductExtendFormComponent } from './product-extend-form.component';

describe('ProductExtendFormComponent', (): void => {
  let component: ProductExtendFormComponent;
  let fixture: ComponentFixture<ProductExtendFormComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [ProductExtendFormComponent],
      }).compileComponents();
    })
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(ProductExtendFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
