import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserListItemComponent } from './admin-user-list-item.component';

xdescribe('AdminUserListItemComponent', () => {
  let component: AdminUserListItemComponent;
  let fixture: ComponentFixture<AdminUserListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminUserListItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
