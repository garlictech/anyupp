import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChainFormComponent } from './chain-form.component';

xdescribe('ChainFormComponent', (): void => {
  let component: ChainFormComponent;
  let fixture: ComponentFixture<ChainFormComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [ChainFormComponent],
      }).compileComponents();
    })
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(ChainFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
