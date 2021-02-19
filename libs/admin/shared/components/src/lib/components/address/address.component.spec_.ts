import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddressComponent } from './address.component';

xdescribe('AddressComponent', (): void => {
  let component: AddressComponent;
  let fixture: ComponentFixture<AddressComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [AddressComponent],
      }).compileComponents();
    }),
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(AddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
