import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UnitFormComponent } from './unit-form.component';

xdescribe('UnitFormComponent', (): void => {
  let component: UnitFormComponent;
  let fixture: ComponentFixture<UnitFormComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [UnitFormComponent],
      }).compileComponents();
    })
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(UnitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
