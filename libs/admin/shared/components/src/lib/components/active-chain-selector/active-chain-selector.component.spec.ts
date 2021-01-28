import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActiveChainSelectorComponent } from './active-chain-selector.component';

describe('ActiveChainSelectorComponent', (): void => {
  let component: ActiveChainSelectorComponent;
  let fixture: ComponentFixture<ActiveChainSelectorComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [ActiveChainSelectorComponent],
      }).compileComponents();
    })
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(ActiveChainSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
