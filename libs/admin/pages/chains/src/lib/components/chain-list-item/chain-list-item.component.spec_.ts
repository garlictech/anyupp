import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChainListItemComponent } from './chain-list-item.component';

xdescribe('ChainListItemComponent', (): void => {
  let component: ChainListItemComponent;
  let fixture: ComponentFixture<ChainListItemComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [ChainListItemComponent],
      }).compileComponents();
    })
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(ChainListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
