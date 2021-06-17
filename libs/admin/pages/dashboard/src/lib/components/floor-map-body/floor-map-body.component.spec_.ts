import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorMapBodyComponent } from './floor-map-body.component';

xdescribe('FloorMapBodyComponent', (): void => {
  let component: FloorMapBodyComponent;
  let fixture: ComponentFixture<FloorMapBodyComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [FloorMapBodyComponent],
    }).compileComponents();
  });

  beforeEach((): void => {
    fixture = TestBed.createComponent(FloorMapBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
