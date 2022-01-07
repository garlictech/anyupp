import * as CrudApi from '@bgap/crud-gql/api';
import { handleRkeeperProducts } from '@bgap/rkeeper-api';
import { S3 } from 'aws-sdk';
import { pipe } from 'fp-ts/lib/function';
import { throwIfEmptyValue } from '@bgap/shared/utils';
import { defer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

const sdk = CrudApi.getCrudSdkForIAM(
  process.env.API_ACCESS_KEY_ID || 'API_ACCESS_KEY_ID NOT DEFINED',
  process.env.API_SECRET_ACCESS_KEY || 'API_SECRET_ACCESS_KEY NOT DEFINED',
);

const s3 = new S3();

pipe(
  {
    Bucket: process.env.BUCKET_NAME || 'BUCKET_NAME NOT DEFINED',
    Key: process.env.objectKey || 'objectKey NOT DEFINED',
  },
  params => defer(() => s3.getObject(params).promise()),
  map(obj => obj.Body?.toString()),
  throwIfEmptyValue(),
  map(x => JSON.parse(x)),
  switchMap(
    handleRkeeperProducts(sdk)(process.env.unitId || 'SOMETHING IS WRONG'),
  ),
).subscribe();
