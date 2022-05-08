import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitBannerUIComponent } from './unit-banner-ui.component';
import { ButtonUIComponent } from '../button-ui/button-ui.component';

describe('UnitBannerUIComponent', () => {
  let component: UnitBannerUIComponent;
  let fixture: ComponentFixture<UnitBannerUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnitBannerUIComponent, ButtonUIComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitBannerUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
