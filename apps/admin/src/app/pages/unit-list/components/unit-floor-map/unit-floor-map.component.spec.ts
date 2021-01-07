import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitFloorMapComponent } from './unit-floor-map.component';

describe('UnitFloorMapComponent', (): void => {
  let component: UnitFloorMapComponent;
  let fixture: ComponentFixture<UnitFloorMapComponent>;

  beforeEach(
    async (): Promise<any> => {
      await TestBed.configureTestingModule({
        declarations: [UnitFloorMapComponent],
      }).compileComponents();
    }
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(UnitFloorMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
