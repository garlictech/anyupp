import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminUserRoleFormComponent } from './admin-user-role-form.component';

describe('AdminUserRoleFormComponent', (): void => {
  let component: AdminUserRoleFormComponent;
  let fixture: ComponentFixture<AdminUserRoleFormComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [AdminUserRoleFormComponent],
      }).compileComponents();
    })
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(AdminUserRoleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
