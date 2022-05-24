import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormContactGroupComponent } from './form-contact-group.component';

xdescribe('ContactGroupComponent', () => {
  let component: FormContactGroupComponent;
  let fixture: ComponentFixture<FormContactGroupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormContactGroupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormContactGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
