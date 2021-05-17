import { AmplifyService } from 'aws-amplify-angular';

import { Injectable } from '@angular/core';
import { IStorageResponse } from '@bgap/shared/types';
import { randomString } from '@bgap/shared/utils';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private _amplifyService: AmplifyService) {}

  public uploadFile(folderPath: string, file: File): Promise<string> {
    const ext = file.name.split('.').pop();
    const key = `${folderPath}/${randomString(16)}.${ext}`;

    return this._amplifyService
      .storage()
      .put(key, file, {
        level: 'public',
        contentType: file.type,
      })
      .then((success: IStorageResponse) => success.key);
  }

  public removeFile(key: string): Promise<void> {
    return this._amplifyService.storage().remove(key);
  }
}
