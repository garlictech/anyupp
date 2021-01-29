import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductCategoryListComponent } from './product-category-list.component';

describe('ProductCategoryListComponent', (): void => {
  let component: ProductCategoryListComponent;
  let fixture: ComponentFixture<ProductCategoryListComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [ProductCategoryListComponent],
      }).compileComponents();
    })
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(ProductCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
