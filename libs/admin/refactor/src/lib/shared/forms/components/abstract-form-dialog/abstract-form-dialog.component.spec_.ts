import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AbstractFormDialogComponent } from './abstract-form-dialog.component';

xdescribe('AbstractFormDialogComponent', () => {
  let component: AbstractFormDialogComponent;
  let fixture: ComponentFixture<AbstractFormDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AbstractFormDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbstractFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
