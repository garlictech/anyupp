import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActiveGroupSelectorComponent } from './active-group-selector.component';

xdescribe('ActiveGroupSelectorComponent', () => {
  let component: ActiveGroupSelectorComponent;
  let fixture: ComponentFixture<ActiveGroupSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ActiveGroupSelectorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveGroupSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
