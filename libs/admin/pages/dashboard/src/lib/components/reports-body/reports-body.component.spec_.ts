import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsBodyComponent } from './reports-body.component';

xdescribe('ReportsBodyComponent', (): void => {
  let component: ReportsBodyComponent;
  let fixture: ComponentFixture<ReportsBodyComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [ReportsBodyComponent],
    }).compileComponents();
  });

  beforeEach((): void => {
    fixture = TestBed.createComponent(ReportsBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
