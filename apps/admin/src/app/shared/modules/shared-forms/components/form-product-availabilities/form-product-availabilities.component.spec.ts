import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormProductAvailabilitiesComponent } from './form-product-availabilities.component';

describe('FormProductAvailabilitiesComponent', (): void => {
  let component: FormProductAvailabilitiesComponent;
  let fixture: ComponentFixture<FormProductAvailabilitiesComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [FormProductAvailabilitiesComponent],
      }).compileComponents();
    })
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(FormProductAvailabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
