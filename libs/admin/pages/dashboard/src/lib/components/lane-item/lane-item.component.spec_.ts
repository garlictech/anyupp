import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaneItemComponent } from './lane-item.component';

xdescribe('LaneItemComponent', (): void => {
  let component: LaneItemComponent;
  let fixture: ComponentFixture<LaneItemComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [LaneItemComponent],
    }).compileComponents();
  });

  beforeEach((): void => {
    fixture = TestBed.createComponent(LaneItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
