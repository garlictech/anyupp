import { TestBed } from '@angular/core/testing';

import { ToasterService } from './toaster.service';

xdescribe('ToasterService', () => {
  let service: ToasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
