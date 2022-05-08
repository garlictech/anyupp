export abstract class AbsImageCompressorService {
  /**
   * @return the compressed file (if it was compressed)
   * @param params
   */
  abstract compress(params: {
    image: File;
    maxWidthOrHeight: number;
  }): Promise<File>;
}
