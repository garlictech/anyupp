import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetFormComponent } from './password-reset-form.component';

describe('PasswordResetFormComponent', (): void => {
  let component: PasswordResetFormComponent;
  let fixture: ComponentFixture<PasswordResetFormComponent>;

  beforeEach(
    async (): Promise<any> => {
      await TestBed.configureTestingModule({
        declarations: [PasswordResetFormComponent],
      }).compileComponents();
    }
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(PasswordResetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
