import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActiveProductCategorySelectorComponent } from './active-product-category-selector.component';

xdescribe('ActiveProductCategorySelectorComponent', (): void => {
  let component: ActiveProductCategorySelectorComponent;
  let fixture: ComponentFixture<ActiveProductCategorySelectorComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [ActiveProductCategorySelectorComponent],
      }).compileComponents();
    }),
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(ActiveProductCategorySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
