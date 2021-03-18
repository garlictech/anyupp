import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormStaticTextComponent } from './form-static-text.component';

xdescribe('FormStaticTextComponent', (): void => {
  let component: FormStaticTextComponent;
  let fixture: ComponentFixture<FormStaticTextComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [FormStaticTextComponent],
      }).compileComponents();
    }),
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(FormStaticTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
