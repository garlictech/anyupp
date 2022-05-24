import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaneItemComponent } from './lane-item.component';

xdescribe('LaneItemComponent', () => {
  let component: LaneItemComponent;
  let fixture: ComponentFixture<LaneItemComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [LaneItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaneItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
