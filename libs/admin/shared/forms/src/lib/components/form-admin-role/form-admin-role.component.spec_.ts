import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormAdminRoleComponent } from './form-admin-role.component';

xdescribe('FormAdminRoleComponent', (): void => {
  let component: FormAdminRoleComponent;
  let fixture: ComponentFixture<FormAdminRoleComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [FormAdminRoleComponent],
      }).compileComponents();
    }),
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(FormAdminRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
