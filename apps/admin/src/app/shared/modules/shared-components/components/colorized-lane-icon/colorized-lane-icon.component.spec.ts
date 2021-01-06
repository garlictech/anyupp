import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorizedLaneIconComponent } from './colorized-lane-icon.component';

describe('ColorizedLaneIconComponent', (): void => {
  let component: ColorizedLaneIconComponent;
  let fixture: ComponentFixture<ColorizedLaneIconComponent>;

  beforeEach(
    async (): Promise<any> => {
      await TestBed.configureTestingModule({
        declarations: [ColorizedLaneIconComponent],
      }).compileComponents();
    }
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(ColorizedLaneIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
