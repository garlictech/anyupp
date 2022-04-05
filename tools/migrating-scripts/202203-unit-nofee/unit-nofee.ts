import { switchMap, tap } from 'rxjs/operators';
import { from } from 'rxjs';
import * as CrudApi from '../../../libs/crud-gql/api/src';

const awsAccessKeyId =
  process.env.API_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '';

const awsSecretAccessKey =
  process.env.API_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '';

const crudSdk = CrudApi.getCrudSdkForIAM(awsAccessKeyId, awsSecretAccessKey);

crudSdk
  .ListUnits()
  .pipe(
    //switchMap(({ items }: { items: CrudApi.Unit[] }) => from(items ?? [])),
    /*mergeMap(unit =>
      crudSdk.UpdateUnit({
        input: {
          location: unit.address.location,
        },
      }),
    ),*/
    tap(x => console.warn(x)),
  )
  .subscribe();
