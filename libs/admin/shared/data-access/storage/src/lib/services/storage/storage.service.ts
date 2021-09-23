import { Injectable } from '@angular/core';
import { randomString } from '@bgap/shared/utils';
import { Storage } from 'aws-amplify';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public async uploadFile(folderPath: string, file: File): Promise<string> {
    const ext = file.name.split('.').pop();
    const key = `${folderPath}/${randomString(16)}.${ext}`;

    await Storage.put(key, file, {
      level: 'public',
      contentType: file.type,
    });
    return key;
  }

  public removeFile(key: string): Promise<unknown> {
    return Storage.remove(key);
  }
}
