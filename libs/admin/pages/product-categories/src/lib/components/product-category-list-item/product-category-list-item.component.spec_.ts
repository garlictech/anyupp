import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductCategoryListItemComponent } from './product-category-list-item.component';

xdescribe('ProductCategoryListItemComponent', (): void => {
  let component: ProductCategoryListItemComponent;
  let fixture: ComponentFixture<ProductCategoryListItemComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [ProductCategoryListItemComponent],
      }).compileComponents();
    }),
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(ProductCategoryListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
