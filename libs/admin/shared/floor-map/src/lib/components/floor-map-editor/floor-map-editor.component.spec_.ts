import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorMapEditorComponent } from './floor-map-editor.component';

xdescribe('FloorMapEditorComponent', (): void => {
  let component: FloorMapEditorComponent;
  let fixture: ComponentFixture<FloorMapEditorComponent>;

  beforeEach(
    async (): Promise<void> => {
      await TestBed.configureTestingModule({
        declarations: [FloorMapEditorComponent],
      }).compileComponents();
    },
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(FloorMapEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
