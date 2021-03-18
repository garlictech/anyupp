import { TestBed } from '@angular/core/testing';

import { ImageCompressorService } from './image-compressor.service';

xdescribe('ImageCompressorService', (): void => {
  let service: ImageCompressorService;

  beforeEach((): void => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageCompressorService);
  });

  it('should be created', (): void => {
    expect(service).toBeTruthy();
  });
});
