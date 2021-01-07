import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricMapEditorComponent } from './fabric-map-editor.component';

describe('FabricMapEditorComponent', (): void => {
  let component: FabricMapEditorComponent;
  let fixture: ComponentFixture<FabricMapEditorComponent>;

  beforeEach(
    async (): Promise<any> => {
      await TestBed.configureTestingModule({
        declarations: [FabricMapEditorComponent],
      }).compileComponents();
    }
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(FabricMapEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
