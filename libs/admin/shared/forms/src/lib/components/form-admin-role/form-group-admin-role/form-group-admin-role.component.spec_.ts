import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormGroupAdminRoleComponent } from './form-group-admin-role.component';

xdescribe('FormGroupAdminRoleComponent', (): void => {
  let component: FormGroupAdminRoleComponent;
  let fixture: ComponentFixture<FormGroupAdminRoleComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [FormGroupAdminRoleComponent],
      }).compileComponents();
    }),
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(FormGroupAdminRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
