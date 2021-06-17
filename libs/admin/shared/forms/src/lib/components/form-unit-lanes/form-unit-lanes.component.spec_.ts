import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUnitLanesComponent } from './form-unit-lanes.component';

xdescribe('FormUnitLanesComponent', (): void => {
  let component: FormUnitLanesComponent;
  let fixture: ComponentFixture<FormUnitLanesComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [FormUnitLanesComponent],
    }).compileComponents();
  });

  beforeEach((): void => {
    fixture = TestBed.createComponent(FormUnitLanesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
