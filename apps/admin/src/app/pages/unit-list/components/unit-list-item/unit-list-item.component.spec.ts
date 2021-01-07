import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UnitListItemComponent } from './unit-list-item.component';

describe('UnitListItemComponent', (): void => {
  let component: UnitListItemComponent;
  let fixture: ComponentFixture<UnitListItemComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [UnitListItemComponent],
      }).compileComponents();
    })
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(UnitListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
