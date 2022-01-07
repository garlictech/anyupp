import { pipe } from 'fp-ts/lib/function';
import * as CrudApi from '@bgap/crud-gql/api';
import { Observable, from, combineLatest } from 'rxjs';
import * as R from 'ramda';
import { concatMap, map, toArray } from 'rxjs/operators';
import { throwIfEmptyValue } from '@bgap/shared/utils';
import { calculatePackagingFeeOfOrder } from '../packaging-utils';
import { getGeneratedProduct } from './utils';

const getNetPackagingFeeOfOrderItem =
  (sdk: CrudApi.CrudSdk) =>
  (item: CrudApi.OrderItemInput): Observable<number> =>
    pipe(
      getGeneratedProduct(sdk)(item.productId),
      map(genProd => genProd?.variants),
      map(R.find(variant => variant.id === item.variantId)),
      throwIfEmptyValue(`Variant not found: ${item.variantId}`),
      map(variant => variant.netPackagingFee || 0),
    );

const getNetPackagingFeeOfConfigComponent =
  (sdk: CrudApi.CrudSdk) =>
  (
    item: CrudApi.OrderItemInput,
    productSetId: string,
    productComponentId: string,
  ): Observable<number> =>
    pipe(
      getGeneratedProduct(sdk)(item.productId),
      map(genProd =>
        pipe(
          genProd?.configSets || [],
          R.find(confSet => confSet?.productSetId === productSetId),
          confSet => confSet?.items || [],
          R.find(
            confItem => confItem?.productComponentId === productComponentId,
          ),
        ),
      ),
      throwIfEmptyValue(`Config set not found. productId: ${item.productId}`),
      map(confSet => confSet.netPackagingFee || 0),
    );

const getNetPackagingFeeOfConfigSets =
  (sdk: CrudApi.CrudSdk) =>
  (
    item: CrudApi.OrderItemInput,
  ): Observable<CrudApi.OrderItemConfigSet[] | undefined> =>
    pipe(
      item.configSets || [],
      x => from(x),
      concatMap(configSet =>
        pipe(
          configSet.items,
          x => from(x),
          concatMap(component =>
            getNetPackagingFeeOfConfigComponent(sdk)(
              item,
              configSet.productSetId,
              component.productComponentId,
            ).pipe(
              map(netPackagingFee => ({
                ...component,
                netPackagingFee,
              })),
            ),
          ),
          toArray(),
          map(items => ({
            ...configSet,
            items,
          })),
        ),
      ),
      toArray(),
      map(sets => (R.isEmpty(sets) ? undefined : sets)),
    );

export const addPackagingFeeToOrder =
  (sdk: CrudApi.CrudSdk) =>
  (
    order: CrudApi.CreateOrderInput,
    currency: string,
    taxPercentage?: number | null,
  ): Observable<CrudApi.CreateOrderInput> =>
    pipe(
      order.items,
      x => from(x),
      concatMap(item =>
        pipe(
          combineLatest([
            getNetPackagingFeeOfOrderItem(sdk)(item),
            getNetPackagingFeeOfConfigSets(sdk)(item),
          ]),
          map(([netPackagingFee, configSets]) => ({
            ...item,
            netPackagingFee,
            configSets,
          })),
        ),
      ),
      toArray(),
      map(items => ({
        ...order,
        items,
        packagingSum: {
          netPrice: calculatePackagingFeeOfOrder(items),
          currency: currency,
          taxPercentage: taxPercentage || 0,
        },
      })),
      map(order => ({
        ...order,
        sumPriceShown: {
          ...order.sumPriceShown,
          priceSum:
            order.sumPriceShown.priceSum +
            order.packagingSum.netPrice *
              (1 + order.packagingSum.taxPercentage / 100.0),
          taxSum:
            order.sumPriceShown.taxSum +
            (order.packagingSum.netPrice * order.packagingSum.taxPercentage) /
              100.0,
        },
      })),
    );
