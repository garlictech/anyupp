import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorizedLaneIconComponent } from './colorized-lane-icon.component';

xdescribe('ColorizedLaneIconComponent', () => {
  let component: ColorizedLaneIconComponent;
  let fixture: ComponentFixture<ColorizedLaneIconComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [ColorizedLaneIconComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorizedLaneIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
