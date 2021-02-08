import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActiveUnitSelectorComponent } from './active-unit-selector.component';

xdescribe('ActiveUnitSelectorComponent', (): void => {
  let component: ActiveUnitSelectorComponent;
  let fixture: ComponentFixture<ActiveUnitSelectorComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [ActiveUnitSelectorComponent],
      }).compileComponents();
    })
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(ActiveUnitSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
