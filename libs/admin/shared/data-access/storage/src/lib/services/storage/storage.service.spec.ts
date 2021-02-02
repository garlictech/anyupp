import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageService', (): void => {
  let service: StorageService;

  beforeEach((): void => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  it('should be created', (): void => {
    expect(service).toBeTruthy();
  });
});
