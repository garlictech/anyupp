import * as A from 'fp-ts/lib/Array';
import * as OE from 'fp-ts-rxjs/lib/ObservableEither';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import * as CrudApi from '@bgap/crud-gql/api';
import { from, forkJoin } from 'rxjs';
import * as R from 'ramda';
import { concatMap, map, toArray } from 'rxjs/operators';
import { calculatePackagingFeeOfOrder } from '../packaging-utils';
import { getGeneratedProduct } from './utils';
import { sequenceS } from 'fp-ts/lib/Apply';

const getNetPackagingFeeOfOrderItem =
  (sdk: CrudApi.CrudSdk) =>
  (item: CrudApi.OrderItemInput): OE.ObservableEither<string, number> =>
    pipe(
      getGeneratedProduct(sdk)(item.productId),
      OE.map(genProd => genProd?.variants),
      OE.map(R.find(variant => variant.id === item.variantId)),
      OE.chain(
        OE.fromPredicate(
          R.complement(R.isNil),
          () => `Variant not found: ${item.variantId}`,
        ),
      ),
      OE.map(variant => variant?.netPackagingFee || 0),
    );

const getNetPackagingFeeOfConfigComponent =
  (sdk: CrudApi.CrudSdk) =>
  (
    item: CrudApi.OrderItemInput,
    productSetId: string,
    productComponentId: string,
  ): OE.ObservableEither<string, number> =>
    pipe(
      getGeneratedProduct(sdk)(item.productId),
      OE.map(genProd =>
        pipe(
          genProd?.configSets || [],
          R.find(confSet => confSet?.productSetId === productSetId),
          confSet => confSet?.items || [],
          R.find(
            confItem => confItem?.productComponentId === productComponentId,
          ),
        ),
      ),
      OE.chain(
        OE.fromPredicate(
          R.complement(R.isNil),
          () => `Config set not found: ${item.productId}`,
        ),
      ),
      OE.map(confSet => confSet.netPackagingFee || 0),
    );

const getNetPackagingFeeOfConfigSets =
  (sdk: CrudApi.CrudSdk) =>
  (
    item: CrudApi.OrderItemInput,
  ): OE.ObservableEither<string, CrudApi.OrderItemConfigSet[] | undefined> =>
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
              OE.map(netPackagingFee => ({
                ...component,
                netPackagingFee,
              })),
            ),
          ),
          toArray(),
          map(A.array.sequence(E.either)),
          OE.map(items => ({
            ...configSet,
            items,
          })),
        ),
      ),
      toArray(),
      map(A.array.sequence(E.either)),
      OE.map(sets => (R.isEmpty(sets) ? undefined : sets)),
    );

export const addPackagingFeeToOrder =
  (sdk: CrudApi.CrudSdk) =>
  (
    order: CrudApi.CreateOrderInput,
    currency: string,
    taxPercentage?: number | null,
  ): OE.ObservableEither<string, CrudApi.CreateOrderInput> =>
    pipe(
      order.items,
      x => from(x),
      concatMap(item =>
        pipe(
          forkJoin([
            getNetPackagingFeeOfOrderItem(sdk)(item),
            getNetPackagingFeeOfConfigSets(sdk)(item),
          ]),
          map(([netPackagingFee, configSets]) => ({
            netPackagingFee,
            configSets,
          })),
          map(sequenceS(E.either)),
          OE.map(({ netPackagingFee, configSets }) => ({
            ...item,
            netPackagingFee,
            configSets,
          })),
        ),
      ),
      toArray(),
      map(A.array.sequence(E.either)),
      OE.map(items => ({
        ...order,
        items,
        packagingSum: {
          netPrice: calculatePackagingFeeOfOrder(items),
          currency: currency,
          taxPercentage: taxPercentage || 0,
        },
      })),
      OE.map(order => ({
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
