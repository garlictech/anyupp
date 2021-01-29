import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormClickableImageInputComponent } from './form-clickable-image-input.component';

describe('FormClickableImageInputComponent', (): void => {
  let component: FormClickableImageInputComponent;
  let fixture: ComponentFixture<FormClickableImageInputComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [FormClickableImageInputComponent],
      }).compileComponents();
    })
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(FormClickableImageInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
