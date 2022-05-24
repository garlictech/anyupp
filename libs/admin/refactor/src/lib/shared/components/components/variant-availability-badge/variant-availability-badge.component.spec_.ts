import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VariantAvailabilityBadgeComponent } from './variant-availability-badge.component';

xdescribe('VariantAvailabilityBadgeComponent', () => {
  let component: VariantAvailabilityBadgeComponent;
  let fixture: ComponentFixture<VariantAvailabilityBadgeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VariantAvailabilityBadgeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariantAvailabilityBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
