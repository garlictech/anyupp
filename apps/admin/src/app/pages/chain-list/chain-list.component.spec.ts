import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChainListComponent } from './chain-list.component';

describe('ChainListComponent', (): void => {
  let component: ChainListComponent;
  let fixture: ComponentFixture<ChainListComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [ChainListComponent],
      }).compileComponents();
    })
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(ChainListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
