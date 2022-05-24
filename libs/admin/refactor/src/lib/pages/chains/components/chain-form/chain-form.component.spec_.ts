import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChainFormComponent } from './chain-form.component';

xdescribe('ChainFormComponent', () => {
  let component: ChainFormComponent;
  let fixture: ComponentFixture<ChainFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ChainFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChainFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
