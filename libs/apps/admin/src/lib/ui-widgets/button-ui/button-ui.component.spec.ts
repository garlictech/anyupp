import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonUIComponent } from './button-ui.component';

describe('ButtonUIComponent', () => {
  let component: ButtonUIComponent;
  let fixture: ComponentFixture<ButtonUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonUIComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
