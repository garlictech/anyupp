import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormTextInputComponent } from './form-text-input.component';

xdescribe('TextInputComponent', (): void => {
  let component: FormTextInputComponent;
  let fixture: ComponentFixture<FormTextInputComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [FormTextInputComponent],
      }).compileComponents();
    })
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(FormTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
