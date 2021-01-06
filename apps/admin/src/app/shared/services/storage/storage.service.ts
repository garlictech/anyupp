import { v1 as uuidV1 } from 'uuid';

import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private _angularFireStorage: AngularFireStorage) {}

  public uploadFile(folderPath: string, file: File): Promise<string> {
    const uuid = uuidV1();
    const ext = file.name.split('.').pop();
    const ref = this._angularFireStorage.ref(`${folderPath}${uuid}.${ext}`);

    return ref.put(file).then((_): Promise<any> => ref.getDownloadURL().toPromise());
  }

  public removeFile(filePath: string): Promise<any> {
    return this._angularFireStorage.storage.refFromURL(filePath).delete();
  }
}
