export abstract class AbsStorageService {
  /**
   * @return the storage path for the uploaded asset
   * @param params
   */
  abstract uploadFile(params: {
    folderPath: string;
    file: File;
  }): Promise<string>;

  abstract removeFile(params: { key: string }): Promise<unknown>;
}
