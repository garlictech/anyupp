import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormContactGroupComponent } from './form-contact-group.component';

xdescribe('ContactGroupComponent', (): void => {
  let component: FormContactGroupComponent;
  let fixture: ComponentFixture<FormContactGroupComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [FormContactGroupComponent],
      }).compileComponents();
    })
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(FormContactGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
