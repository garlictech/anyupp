import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormStaffRoleComponent } from './form-staff-role.component';

xdescribe('FormStaffRoleComponent', (): void => {
  let component: FormStaffRoleComponent;
  let fixture: ComponentFixture<FormStaffRoleComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [FormStaffRoleComponent],
      }).compileComponents();
    }),
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(FormStaffRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
