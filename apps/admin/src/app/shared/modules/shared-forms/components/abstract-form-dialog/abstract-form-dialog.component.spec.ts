import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AbstractFormDialogComponent } from './abstract-form-dialog.component';

describe('AbstractFormDialogComponent', (): void => {
  let component: AbstractFormDialogComponent;
  let fixture: ComponentFixture<AbstractFormDialogComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [AbstractFormDialogComponent],
      }).compileComponents();
    })
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(AbstractFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
