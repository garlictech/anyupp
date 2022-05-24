import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanesBodyComponent } from './lanes-body.component';

xdescribe('LanesBodyComponent', () => {
  let component: LanesBodyComponent;
  let fixture: ComponentFixture<LanesBodyComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [LanesBodyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanesBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
