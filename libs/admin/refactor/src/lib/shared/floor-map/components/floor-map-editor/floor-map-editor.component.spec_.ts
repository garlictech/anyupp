import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorMapEditorComponent } from './floor-map-editor.component';

xdescribe('FloorMapEditorComponent', () => {
  let component: FloorMapEditorComponent;
  let fixture: ComponentFixture<FloorMapEditorComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [FloorMapEditorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorMapEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
