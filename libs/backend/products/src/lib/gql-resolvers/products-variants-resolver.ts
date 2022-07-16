import { getAllPaginatedData } from '@bgap/gql-sdk';
import * as R from 'ramda';
import { UnitProduct, UpdateUnitProductInput } from '@bgap/domain';
import { pipe } from 'fp-ts/lib/function';

import {
  ProductVariant,
  CrudSdk,
  CreateUnitProductInput,
  CreateVariantInput,
  UpdateVariantInput,
} from '@bgap/crud-gql/api';
import { Observable, of, iif, forkJoin } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';

export interface ProductVariantsResolverDeps {
  crudSdk: CrudSdk;
}

export const createVariantsHandler =
  (input: CreateVariantInput) => (deps: ProductVariantsResolverDeps) =>
    deps.crudSdk.CreateVariant({ input });

export const updateVariantsHandler =
  (input: UpdateVariantInput) => (deps: ProductVariantsResolverDeps) =>
    deps.crudSdk.UpdateVariant({ input });

export const upsertVariantsHandler =
  (deps: ProductVariantsResolverDeps) =>
  (
    ownerProduct: string,
    variants?: Array<Record<string, unknown> | undefined | null> | null,
  ) =>
    pipe(
      variants ?? [],
      variants => R.reject(R.isNil)(variants),
      R.map(variant => ({
        ...variant,
        ownerProduct,
      })),
      R.map((variant: Record<string, unknown>) =>
        iif(
          () => !variant?.id,
          createVariantsHandler(variant as unknown as CreateVariantInput)(deps),
          deps.crudSdk
            .GetVariant({ id: variant.id as string })
            .pipe(
              switchMap(variantFromDb =>
                iif(
                  () => !!variantFromDb,
                  updateVariantsHandler(
                    variant as unknown as UpdateVariantInput,
                  )(deps),
                  createVariantsHandler(
                    variant as unknown as CreateVariantInput,
                  )(deps),
                ),
              ),
            ),
        ),
      ),
      forkJoin,
    );

export const getVariantsHandler =
  (deps: ProductVariantsResolverDeps) => (ownerProduct: string) =>
    getAllPaginatedData(deps.crudSdk.SearchVariants, {
      query: {
        filter: {
          ownerProduct: {
            eq: ownerProduct,
          },
        },
      },
    }).pipe(
      map(result =>
        pipe(result?.items ?? [], variants => R.reject(R.isNil)(variants)),
      ),
    );

export const productVariantsResolver =
  (deps: ProductVariantsResolverDeps) =>
  (
    _requestArguments: unknown,
    source: Record<string, unknown> & { __operation?: string; id: string },
  ) => {
    // In field resolvers, in case of mutation, the system adds an
    // __operation: 'Mutation' field to the parent. We decide if the
    // mutation is crete or ubdate by checking the parent (source) id.
    // If it does not exist, then it is a create. If it exists, and the data
    // alos exists, then it is an update.
    //
    // see: https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-chains
    const selectHandler = (): Function =>
      R.cond([
        [
          () => source.__operation === 'Mutation',
          () =>
            upsertVariantsHandler(deps)(
              source.id,
              source?.variants as Record<string, unknown>[],
            ),
        ],
        [
          () => R.isNil(source.__operation),
          () => getVariantsHandler(deps)(source.id),
        ],
        [
          R.T,
          () => {
            throw 'Unknown operation on variants field';
          },
        ],
      ]);

    return selectHandler()();
  };
