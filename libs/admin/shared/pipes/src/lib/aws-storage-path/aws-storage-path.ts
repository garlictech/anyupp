import { AmplifyService } from 'aws-amplify-angular';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'awsStoragePath',
})
export class AwsStoragePathPipe implements PipeTransform {
  constructor(private _amplifyService: AmplifyService) {}
  async transform(key: string): Promise<string> {
    return key
      ? await this._amplifyService
          .storage()
          .get(key)
          .then((filePath: string) => filePath)
      : '';
  }
}
