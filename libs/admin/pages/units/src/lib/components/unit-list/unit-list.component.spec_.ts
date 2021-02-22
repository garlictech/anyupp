import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UnitListComponent } from './unit-list.component';

xdescribe('UnitListComponent', (): void => {
  let component: UnitListComponent;
  let fixture: ComponentFixture<UnitListComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [UnitListComponent],
      }).compileComponents();
    })
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(UnitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
