import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitListItemComponent } from './unit-list-item.component';

describe('UnitListItemComponent', () => {
  let component: UnitListItemComponent;
  let fixture: ComponentFixture<UnitListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
