import { AbsImageCompressorService } from '@bgap/domain';

export class MockImageCompressionService extends AbsImageCompressorService {
  compress({
    image,
  }: {
    image: File;
    maxWidthOrHeight: number;
  }): Promise<File> {
    return Promise.resolve(image);
  }
}
