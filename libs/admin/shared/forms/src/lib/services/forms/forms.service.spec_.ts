import { TestBed } from '@angular/core/testing';

import { FormsService } from './forms.service';

xdescribe('FormsService', (): void => {
  let service: FormsService;

  beforeEach((): void => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormsService);
  });

  it('should be created', (): void => {
    expect(service).toBeTruthy();
  });
});
