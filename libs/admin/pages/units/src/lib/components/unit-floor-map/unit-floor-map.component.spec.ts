import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitFloorMapComponent } from './unit-floor-map.component';

describe('UnitFloorMapComponent', () => {
  let component: UnitFloorMapComponent;
  let fixture: ComponentFixture<UnitFloorMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitFloorMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitFloorMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
