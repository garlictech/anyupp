import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormProductAvailabilitiesComponent } from './form-product-availabilities.component';

xdescribe('FormProductAvailabilitiesComponent', () => {
  let component: FormProductAvailabilitiesComponent;
  let fixture: ComponentFixture<FormProductAvailabilitiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormProductAvailabilitiesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormProductAvailabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
