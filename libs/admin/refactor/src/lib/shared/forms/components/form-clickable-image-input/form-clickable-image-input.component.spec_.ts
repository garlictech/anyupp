import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormClickableImageInputComponent } from './form-clickable-image-input.component';

xdescribe('FormClickableImageInputComponent', () => {
  let component: FormClickableImageInputComponent;
  let fixture: ComponentFixture<FormClickableImageInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormClickableImageInputComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormClickableImageInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
