import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormUnitAdminRoleComponent } from './form-unit-admin-role.component';

describe('FormUnitAdminRoleComponent', (): void => {
  let component: FormUnitAdminRoleComponent;
  let fixture: ComponentFixture<FormUnitAdminRoleComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [FormUnitAdminRoleComponent],
      }).compileComponents();
    })
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(FormUnitAdminRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
