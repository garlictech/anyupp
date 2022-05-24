import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormStaticTextComponent } from './form-static-text.component';

xdescribe('FormStaticTextComponent', () => {
  let component: FormStaticTextComponent;
  let fixture: ComponentFixture<FormStaticTextComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormStaticTextComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormStaticTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
