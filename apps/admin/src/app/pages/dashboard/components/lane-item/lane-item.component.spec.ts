import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaneItemComponent } from './lane-item.component';

describe('LaneItemComponent', (): void => {
  let component: LaneItemComponent;
  let fixture: ComponentFixture<LaneItemComponent>;

  beforeEach(
    async (): Promise<any> => {
      await TestBed.configureTestingModule({
        declarations: [LaneItemComponent],
      }).compileComponents();
    }
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(LaneItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
