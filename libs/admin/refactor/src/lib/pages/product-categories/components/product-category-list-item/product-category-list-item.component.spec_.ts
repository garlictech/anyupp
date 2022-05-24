import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductCategoryListItemComponent } from './product-category-list-item.component';

xdescribe('ProductCategoryListItemComponent', () => {
  let component: ProductCategoryListItemComponent;
  let fixture: ComponentFixture<ProductCategoryListItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProductCategoryListItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCategoryListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
