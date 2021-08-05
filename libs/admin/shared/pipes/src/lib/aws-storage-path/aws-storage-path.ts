import { Pipe, PipeTransform } from '@angular/core';
import { awsConfig } from '@bgap/crud-gql/api';

@Pipe({
  name: 'awsStoragePath',
})
export class AwsStoragePathPipe implements PipeTransform {
  transform(key: string): string {
    return key
      ? key.indexOf('http') === 0
        ? key
        : `https://${awsConfig.aws_user_files_s3_bucket}.s3-${awsConfig.aws_user_files_s3_bucket_region}.amazonaws.com/public/${key}`
      : '';
  }
}
