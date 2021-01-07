import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminUserListItemComponent } from './admin-user-list-item.component';

describe('AdminListItemComponent', (): void => {
  let component: AdminUserListItemComponent;
  let fixture: ComponentFixture<AdminUserListItemComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [AdminUserListItemComponent],
      }).compileComponents();
    })
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(AdminUserListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
