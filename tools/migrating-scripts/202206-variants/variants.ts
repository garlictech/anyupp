import { switchMap, tap, map, mergeMap } from 'rxjs/operators';
import { from } from 'rxjs';

import { getAllPaginatedData } from '../../../libs/gql-sdk/src';
import * as R from 'ramda';
import { flow } from 'fp-ts/lib/function';
import { Order, ServiceFeeType } from '../../../libs/domain/src';
import { getCrudSdkForIAM } from '../../../libs/crud-gql/api/src';

const awsAccessKeyId =
  process.env.API_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '';

const awsSecretAccessKey =
  process.env.API_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '';

const crudSdk = getCrudSdkForIAM(awsAccessKeyId, awsSecretAccessKey);

// List all the Unit Products
// Get all the variants in the variants array
// Create a variant
// Collect the ID-s
// update the variantId list with the variant id-s
// update the embedded variants with the variant ID-s
// repeat the above to the chain and group products

getAllPaginatedData(crudSdk.ListOrders)
  .pipe(
    map(
      flow(
        res => (res?.items || []) as Order[],
        (res: Order[]) =>
          R.filter(
            (order: Order) =>
              order?.serviceFeePolicy?.type === ServiceFeeType.nofee,
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
