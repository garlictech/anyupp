import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActiveUnitSelectorComponent } from './active-unit-selector.component';

xdescribe('ActiveUnitSelectorComponent', () => {
  let component: ActiveUnitSelectorComponent;
  let fixture: ComponentFixture<ActiveUnitSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ActiveUnitSelectorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveUnitSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
