import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormColorPickerComponent } from './form-color-picker.component';

describe('FormColorPickerComponent', (): void => {
  let component: FormColorPickerComponent;
  let fixture: ComponentFixture<FormColorPickerComponent>;

  beforeEach(
    async (): Promise<any> => {
      await TestBed.configureTestingModule({
        declarations: [FormColorPickerComponent],
      }).compileComponents();
    }
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(FormColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
