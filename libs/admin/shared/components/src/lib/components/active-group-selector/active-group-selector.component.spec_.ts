import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActiveGroupSelectorComponent } from './active-group-selector.component';

xdescribe('ActiveGroupSelectorComponent', (): void => {
  let component: ActiveGroupSelectorComponent;
  let fixture: ComponentFixture<ActiveGroupSelectorComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [ActiveGroupSelectorComponent],
      }).compileComponents();
    })
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(ActiveGroupSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
