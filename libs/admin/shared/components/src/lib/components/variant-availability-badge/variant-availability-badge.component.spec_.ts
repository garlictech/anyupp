import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VariantAvailabilityBadgeComponent } from './variant-availability-badge.component';

xdescribe('VariantAvailabilityBadgeComponent', (): void => {
  let component: VariantAvailabilityBadgeComponent;
  let fixture: ComponentFixture<VariantAvailabilityBadgeComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [VariantAvailabilityBadgeComponent],
      }).compileComponents();
    }),
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(VariantAvailabilityBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
