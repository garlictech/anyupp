import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactComponent } from './contact.component';

xdescribe('ContactComponent', (): void => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [ContactComponent],
      }).compileComponents();
    }),
  );

  beforeEach((): void => {
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
