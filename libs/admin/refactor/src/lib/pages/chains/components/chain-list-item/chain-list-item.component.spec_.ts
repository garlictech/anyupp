import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChainListItemComponent } from './chain-list-item.component';

xdescribe('ChainListItemComponent', () => {
  let component: ChainListItemComponent;
  let fixture: ComponentFixture<ChainListItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ChainListItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChainListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
