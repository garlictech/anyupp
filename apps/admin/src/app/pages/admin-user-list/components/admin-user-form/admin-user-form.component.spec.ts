import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminUserFormComponent } from './admin-user-form.component';

describe('AdminUserFormComponent', (): void => {
  let component: AdminUserFormComponent;
  let fixture: ComponentFixture<AdminUserFormComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [AdminUserFormComponent],
      }).compileComponents();
    })
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(AdminUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
