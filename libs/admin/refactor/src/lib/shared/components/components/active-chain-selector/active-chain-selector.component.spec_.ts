import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActiveChainSelectorComponent } from './active-chain-selector.component';

xdescribe('ActiveChainSelectorComponent', () => {
  let component: ActiveChainSelectorComponent;
  let fixture: ComponentFixture<ActiveChainSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ActiveChainSelectorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveChainSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
