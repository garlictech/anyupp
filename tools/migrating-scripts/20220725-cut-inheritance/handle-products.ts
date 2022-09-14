import { switchMap, tap, map, mergeMap } from 'rxjs/operators';
import { forkJoin, from, of } from 'rxjs';
import { getAllPaginatedData } from '../../../libs/gql-sdk/src';
import * as R from 'ramda';
import { pipe } from 'fp-ts/lib/function';
import {
  ChainProduct,
  getCrudSdkForIAM,
  GroupProduct,
  UnitProduct,
} from '../../../libs/crud-gql/api/src';

const awsAccessKeyId =
  process.env.API_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '';

const awsSecretAccessKey =
  process.env.API_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '';

const crudSdk = getCrudSdkForIAM(awsAccessKeyId, awsSecretAccessKey);

getAllPaginatedData(crudSdk.ListUnitProducts)
  .pipe(
    map(res =>
      pipe(
        res?.items || [],
        R.reject(R.isNil),
        R.filter((product: UnitProduct) => !!product?.parentId),
        products => products as UnitProduct[],
      ),
    ),
    tap(x => console.log(`Processing ${x.length} products...`)),
    switchMap(x => from(x)),
    mergeMap((product: UnitProduct) =>
      crudSdk
        .GetGroupProduct({
          id: product.parentId!,
        })
        .pipe(
          switchMap((groupProduct?: GroupProduct | null) =>
            crudSdk
              .GetChainProduct({
                id: groupProduct?.parentId!,
              })
              .pipe(
                switchMap((chainProduct?: ChainProduct | null) =>
                  !!groupProduct && !!chainProduct
                    ? crudSdk.UpdateUnitProduct({
                        input: pipe(
                          R.mergeDeepRight(
                            R.mergeDeepRight(chainProduct, groupProduct),
                            product,
                          ),
                          R.omit(['createdAt', 'updatedAt']),
                        ) as any,
                      })
                    : of(null),
                ),
              ),
          ),
        ),
    ),
    tap((x: any) => console.warn('Processed: ', x?.id)),
  )
  .subscribe();
