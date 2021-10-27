import { unitRequestHandler } from '@bgap/anyupp-gql/backend';
import { flow, pipe } from 'fp-ts/lib/function';
import * as R from 'ramda';
import * as Joi from 'joi';
import * as CrudApi from '@bgap/crud-gql/api';
import { validateSchema } from '@bgap/shared/data-validators';
import {
  map,
  tap,
  switchMap,
  concatMap,
  toArray,
  mergeMap,
  count,
  catchError,
  delay,
  mapTo,
} from 'rxjs/operators';
import {
  combineLatest,
  from,
  Observable,
  of,
  pipe as rxPipe,
  throwError,
  UnaryFunction,
} from 'rxjs';
import {
  filterNullishGraphqlListWithDefault,
  throwIfEmptyValue,
} from '@bgap/shared/utils';

// make sure that everything gets (re)indexed
const ES_DELAY = 5000; //ms

export interface ProductUpdateCommands {
  chain: CrudApi.UpdateChainProductInput;
  unit: CrudApi.UpdateUnitProductInput;
  group: CrudApi.UpdateGroupProductInput;
}

export interface Dish {
  price: number;
  active: boolean;
  id: string;
  guid: string;
  name: string;
}

const dishSchema = {
  price: Joi.number().integer().required(),
  active: Joi.number(),
  id: Joi.number().required(),
  guid: Joi.string().required(),
  name: Joi.string().required(),
};

export const { validate: validateDish, isType: isDish } = validateSchema<Dish>(
  dishSchema,
  'Dish',
  true,
);

export const normalizeDish = (dish: Dish) => ({
  ...dish,
  id: dish.id.toString(),
  name: (() => {
    try {
      return decodeURIComponent(escape(dish.name));
    } catch (_err) {
      return dish.name;
    }
  })(),
  price: dish.price / 100,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const processDishes = (rawData: any) =>
  pipe(
    rawData?.data?.dishes,
    R.uniqWith((a, b) => a.id === b.id),
    from,
    concatMap(dish =>
      validateDish(dish).pipe(
        catchError(err => {
          console.warn(
            `Found an invalid record: ${JSON.stringify(
              dish,
              null,
              2,
            )}. The problem: (${JSON.stringify(err, null, 2)})`,
          );
          return of(null);
        }),
      ),
    ),
    toArray(),
    map(
      flow(
        x => R.filter(R.complement(R.isNil), x) as Dish[],
        R.map(normalizeDish),
      ),
    ),
  );

export const externalProductIdMaker = (guid: string) => guid;

const getFirstFoundItem = <T>(): UnaryFunction<
  Observable<
    | {
        items?: Array<T | null | undefined> | null;
        nextToken?: string | null;
      }
    | null
    | undefined
  >,
  Observable<T | null>
> =>
  rxPipe(
    filterNullishGraphqlListWithDefault<T>([]),
    tap(items => {
      if (items.length > 1) {
        console.warn('Found multiple unit products with the same clientid!');
      }
    }),
    map(items => items[0] ?? null),
  );

export const searchExternalUnitProduct =
  (sdk: CrudApi.CrudSdk) =>
  (
    rkeeperProductGuid: string,
  ): Observable<CrudApi.Maybe<CrudApi.UnitProduct>> =>
    sdk
      .SearchUnitProducts({
        filter: {
          clientSideId: {
            eq: externalProductIdMaker(rkeeperProductGuid),
          },
        },
      })
      .pipe(getFirstFoundItem());

export interface RKeeperBusinessEntityInfo {
  chainId: string;
  groupId: string;
  unitId: string;
}

export const getBusinessEntityInfo =
  (sdk: CrudApi.CrudSdk) =>
  (externalRestaurantId: string): Observable<RKeeperBusinessEntityInfo> =>
    sdk
      .SearchUnits({
        filter: { externalRestaurantId: { eq: externalRestaurantId } },
      })
      .pipe(
        getFirstFoundItem(),
        throwIfEmptyValue(
          `Cannot find unit belonging to external unit id ${externalRestaurantId}`,
        ),
        map(unit => ({
          unitId: unit.id,
          chainId: unit.chainId,
          groupId: unit.groupId,
        })),
      );

export const createRkeeperProduct =
  (sdk: CrudApi.CrudSdk) =>
  (businessEntity: RKeeperBusinessEntityInfo, dish: Dish) =>
    sdk
      .CreateChainProduct({
        input: {
          productCategoryId: defaultProductCategoryId,
          chainId: businessEntity.chainId,
          name: {
            hu: dish.name,
          },
          productType: 'dish',
          isVisible: true,
          dirty: true,
          variants: [
            {
              id: 'id',
              variantName: {
                hu: 'foobar',
              },

              price: dish.price,
              isAvailable: true,
              position: -1,
            },
          ],
        },
      })
      .pipe(
        throwIfEmptyValue(),
        switchMap(chainProduct =>
          sdk.CreateGroupProduct({
            input: {
              parentId: chainProduct.id,
              chainId: businessEntity.chainId,
              groupId: businessEntity.groupId,
              isVisible: true,
              tax: -1,
              dirty: true,
              variants: [
                {
                  id: 'id',
                  variantName: {
                    hu: 'foobar',
                  },
                  price: dish.price,
                  isAvailable: true,
                  position: -1,
                },
              ],
            },
          }),
        ),
        throwIfEmptyValue(),
        switchMap(groupProduct =>
          sdk.CreateUnitProduct({
            input: {
              parentId: groupProduct.id,
              chainId: businessEntity.chainId,
              groupId: businessEntity.groupId,
              unitId: businessEntity.unitId,
              isVisible: dish.active,
              position: -1,
              supportedServingModes: [CrudApi.ServingMode.inplace],
              clientSideId: externalProductIdMaker(dish.guid),
              variants: [
                {
                  id: 'id',
                  variantName: {
                    hu: dish.name,
                  },
                  isAvailable: dish.active,
                  price: dish.price,
                  position: -1,
                  availabilities: [
                    {
                      type: 'A',
                      price: dish.price,
                    },
                  ],
                  pack: {
                    size: 1,
                    unit: 'zsák',
                  },
                },
              ],
              dirty: true,
            },
          }),
        ),
      );

export const updateRkeeperProduct =
  (sdk: CrudApi.CrudSdk) =>
  (dish: Dish, foundUnitProduct: CrudApi.UnitProduct) =>
    sdk.UpdateUnitProduct({
      input: {
        id: foundUnitProduct.id,
        isVisible: dish.active,
        variants: [
          {
            ...(foundUnitProduct?.variants?.[0] ?? {}),
            id: 'id',
            variantName: {
              hu: dish.name,
            },
            isAvailable: dish.active,
            price: dish.price,
            position: -1,
            availabilities: [
              {
                type: 'A',
                price: dish.price,
              },
            ],
          },
        ],
      },
    });

// This is a placeholder product category
export const defaultProductCategoryId = 'default-product-category';

export const createDefaultProductCategory =
  (sdk: CrudApi.CrudSdk) => (businessEntityInfo: RKeeperBusinessEntityInfo) =>
    sdk
      .CreateProductCategory({
        input: {
          id: defaultProductCategoryId,
          chainId: businessEntityInfo.chainId,
          name: {
            en: 'Default category',
            hu: 'Alap kategória',
          },
          position: -1,
        },
      })
      .pipe(
        catchError(err =>
          JSON.stringify(err).includes('The conditional request failed')
            ? of(true)
            : throwError(err),
        ),
        mapTo(true),
      );

export const handleRkeeperProducts =
  (sdk: CrudApi.CrudSdk) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (externalRestaurantId: string, rawData: any): Observable<boolean> =>
    combineLatest(
      getBusinessEntityInfo(sdk)(externalRestaurantId),
      processDishes(rawData),
    ).pipe(
      switchMap(([businessEntityInfo, dishes]) =>
        createDefaultProductCategory(sdk)(businessEntityInfo).pipe(
          tap(() =>
            console.log(`${dishes.length} products will be processed.`),
          ),
          switchMap(() => from(dishes)),
          mergeMap(
            dish =>
              searchExternalUnitProduct(sdk)(dish.guid).pipe(
                switchMap(unitProduct =>
                  unitProduct === null
                    ? createRkeeperProduct(sdk)(businessEntityInfo, dish)
                    : updateRkeeperProduct(sdk)(dish, unitProduct),
                ),
              ),
            100,
          ),
          tap(() => console.log('... a product processed')),
          count(),
          tap(i => console.log(i + ' Product processed')),
          delay(ES_DELAY),
          switchMap(() =>
            unitRequestHandler(sdk).regenerateUnitData({
              input: { id: businessEntityInfo.unitId },
            }),
          ),
        ),
      ),
    );

// process modifiers
//
// 1. menj végig a dish-eken. Vedd ki a modischema-ből a hozzá tartozó modifyer groupot.
// 2. A modifuerekből csinálj create v update (validátorokkal) operátorokat. Hajtsd őket végre.
// 3. Cachel-d be az eredményt, a cache: modi id => anyupp id.
// 4. A cache-ből próbáld venni az id-ket, ha nincs id, akkro jòn a végrehajtás.
// 5. Add hozzá a modifyereket a productokhoz.
