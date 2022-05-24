import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorMapOrdersComponent } from './floor-map-orders.component';

xdescribe('FloorMapOrdersComponent', () => {
  let component: FloorMapOrdersComponent;
  let fixture: ComponentFixture<FloorMapOrdersComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [FloorMapOrdersComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorMapOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
