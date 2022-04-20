import { switchMap, tap, map, mergeMap } from 'rxjs/operators';
import { from } from 'rxjs';
import * as CrudApi from '../../../libs/crud-gql/api/src';
import { getAllPaginatedData } from '../../../libs/gql-sdk/src';
import * as R from 'ramda';
import { flow } from 'fp-ts/lib/function';

const awsAccessKeyId =
  process.env.API_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '';

const awsSecretAccessKey =
  process.env.API_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '';

const crudSdk = CrudApi.getCrudSdkForIAM(awsAccessKeyId, awsSecretAccessKey);

getAllPaginatedData(crudSdk.ListOrders)
  .pipe(
    map(
      flow(
        res => (res?.items || []) as CrudApi.Order[],
        (res: CrudApi.Order[]) =>
          R.filter(
            (order: CrudApi.Order) =>
              order?.serviceFeePolicy?.type === CrudApi.ServiceFeeType.nofee,
          )(res),
      ),
    ),
    tap(x => console.log(`Processing ${x.length} orders...`)),
    switchMap(x => from(x)),
    mergeMap(
      order =>
        crudSdk.UpdateOrder({
          input: {
            id: order.id,
            serviceFeePolicy: null,
          },
        }),
      10,
    ),
    tap((x: any) => console.warn('Processed: ', x?.id)),
  )
  .subscribe();
