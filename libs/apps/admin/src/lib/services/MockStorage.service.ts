import { AbsStorageService } from '@bgap/domain';

export class MockStorageService extends AbsStorageService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  uploadFile(params: { folderPath: string; file: File }): Promise<string> {
    return new Promise<string>(resolve => {
      setTimeout(() => {
        resolve('640/360');
      }, 3000);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeFile(params: { key: string }): Promise<unknown> {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });
  }
}
