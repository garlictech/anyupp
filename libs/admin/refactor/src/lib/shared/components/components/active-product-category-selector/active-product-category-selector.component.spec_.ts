import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActiveProductCategorySelectorComponent } from './active-product-category-selector.component';

xdescribe('ActiveProductCategorySelectorComponent', () => {
  let component: ActiveProductCategorySelectorComponent;
  let fixture: ComponentFixture<ActiveProductCategorySelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ActiveProductCategorySelectorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveProductCategorySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
