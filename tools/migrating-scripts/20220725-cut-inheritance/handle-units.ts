import { switchMap, tap, map, mergeMap } from 'rxjs/operators';
import { forkJoin, from, of } from 'rxjs';
import { getAllPaginatedData } from '../../../libs/gql-sdk/src';
import * as R from 'ramda';
import { pipe } from 'fp-ts/lib/function';
import { getCrudSdkForIAM, Unit } from '../../../libs/crud-gql/api/src';

const awsAccessKeyId =
  process.env.API_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '';

const awsSecretAccessKey =
  process.env.API_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '';

const crudSdk = getCrudSdkForIAM(awsAccessKeyId, awsSecretAccessKey);

getAllPaginatedData(crudSdk.ListUnits)
  .pipe(
    map(res =>
      pipe(
        res?.items || [],
        R.reject(R.isNil),
        R.filter((unit: Unit) => !!unit?.groupId && !!unit?.chainId),
        units => units as Unit[],
      ),
    ),
    tap(x => console.log(`Processing ${x.length} units...`)),
    switchMap(x => from(x)),
    mergeMap((unit: Unit) =>
      forkJoin([
        crudSdk.GetGroup({
          id: unit.groupId!,
        }),
        crudSdk.GetChain({
          id: unit.chainId!,
        }),
      ]).pipe(
        switchMap(([group, chain]) =>
          !!group && !!chain
            ? crudSdk.UpdateUnit({
                input: {
                  id: unit.id,
                  currency: group.currency,
                  style: chain.style,
                  categoryOrders: chain.categoryOrders,
                },
              })
            : of(null),
        ),
      ),
    ),
    tap((x: any) => console.warn('Processed: ', x?.id)),
  )
  .subscribe();
