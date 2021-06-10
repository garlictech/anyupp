import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusLedComponent } from './status-led.component';

xdescribe('StatusLedComponent', (): void => {
  let component: StatusLedComponent;
  let fixture: ComponentFixture<StatusLedComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [StatusLedComponent],
    }).compileComponents();
  });

  beforeEach((): void => {
    fixture = TestBed.createComponent(StatusLedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
