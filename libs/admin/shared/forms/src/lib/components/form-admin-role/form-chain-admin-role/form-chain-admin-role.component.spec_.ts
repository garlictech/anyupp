import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormChainAdminRoleComponent } from './form-chain-admin-role.component';

xdescribe('FormChainAdminRoleComponent', (): void => {
  let component: FormChainAdminRoleComponent;
  let fixture: ComponentFixture<FormChainAdminRoleComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [FormChainAdminRoleComponent],
      }).compileComponents();
    }),
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(FormChainAdminRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
