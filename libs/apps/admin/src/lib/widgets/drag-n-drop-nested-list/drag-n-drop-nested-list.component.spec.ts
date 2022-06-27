import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragNDropNestedListComponent } from './drag-n-drop-nested-list.component';

describe('DragNDropNestedListComponent', () => {
  let component: DragNDropNestedListComponent;
  let fixture: ComponentFixture<DragNDropNestedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DragNDropNestedListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DragNDropNestedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
