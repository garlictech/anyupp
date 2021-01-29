import { TestBed } from '@angular/core/testing';

import { ToasterService } from './toaster.service';

describe('ToasterService', (): void => {
  let service: ToasterService;

  beforeEach((): void => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToasterService);
  });

  it('should be created', (): void => {
    expect(service).toBeTruthy();
  });
});
