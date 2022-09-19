/* eslint-disable @typescript-eslint/no-explicit-any */
import * as OO from 'fp-ts-rxjs/ObservableOption';
import * as OE from 'fp-ts-rxjs/ObservableEither';
import { flow, pipe } from 'fp-ts/lib/function';
import * as R from 'ramda';
import * as O from 'fp-ts/lib/Option';
import * as Joi from 'joi';

/*
   "data": {
    "dishes": [
      {
        "type": "dish",
        "modiweight": 0,
        "price": 0,
        "modischeme": 0,
        "active": 0,
        "id": 1040917,
        "guid": "ab1c4276-2ce6-4a29-bf39-ced30d352666",
        "code": 2606,
        "name": "Picér hívás",
        "variation": 4609
      }
    ]
....
    "variations": [
      {
        "id": 4609,
        "name": "termék"
      }
    ]
 */

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
  mapTo,
  shareReplay,
} from 'rxjs/operators';
import {
  from,
  Observable,
  of,
  pipe as rxPipe,
  throwError,
  UnaryFunction,
  forkJoin,
} from 'rxjs';
import {
  filterNullishElements,
  filterNullishGraphqlListWithDefault,
  oeTryCatch,
  throwIfEmptyValue,
} from '@bgap/shared/utils';
import {
  Maybe,
  ProductComponent,
  ProductComponentSetType,
  ProductConfigComponent,
  ProductConfigSet,
  ProductType,
  ServingMode,
  UnitProduct,
  UpdateUnitProductInput,
} from '@bgap/domain';
import { CrudSdk } from '@bgap/crud-gql/api';

// make sure that everything gets (re)indexed
export const ES_DELAY = 5000; //ms

export const decodeName = (name: string) => {
  {
    try {
      return decodeURIComponent(escape(name));
    } catch (_err) {
      return name;
    }
  }
};

const normalizeCommon = (data: Modifier | Dish) => ({
  ...data,
  name: decodeName(data.name),
  price: data.price / 100,
});

const commonSchema = {
  price: Joi.number().integer().required(),
  active: Joi.number(),
  id: Joi.number().required(),
  name: Joi.string().required(),
};

export interface ProductUpdateCommands {
  unit: UpdateUnitProductInput;
}

export interface Dish {
  price: number;
  active: boolean;
  id: number;
  guid: string;
  name: string;
  modischeme?: number;
  variation?: number;
}

const dishSchema = {
  ...commonSchema,
  guid: Joi.string().required(),
  modischeme: Joi.number().integer(),
  variation: Joi.number().integer(),
};

export const { validate: validateDish, isType: isDish } = validateSchema<Dish>(
  dishSchema,
  'Dish',
  true,
);

export const normalizeDish = (dish: Dish): Dish => ({
  ...normalizeCommon(dish),
  guid: dish.guid,
});

export interface Variation {
  id: string;
  name: string;
}

const variationSchema = {
  id: Joi.number().integer().required(),
  name: Joi.string().required(),
};

export const { validate: validateVariation, isType: isVariation } =
  validateSchema<Variation>(variationSchema, 'Variation', true);

// According to rkeeper solution, the waiter caller info is a special "Dish"...
// not optimal.
export interface WaiterCallerProduct {
  active: boolean;
  id: number;
  name: string;
}

const waiterCallerProductSchema = {
  active: Joi.number(),
  id: Joi.number().required(),
  name: Joi.string().required(),
};

export const {
  validate: validateWaiterCallerProduct,
  isType: isWaiterCallerProduct,
} = validateSchema<WaiterCallerProduct>(
  waiterCallerProductSchema,
  'WaiterCallerProduct',
  true,
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const processDishes = (rawData: any): Observable<Dish[]> =>
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
        x => R.reject((dish: Dish) => dish.variation != undefined, x),
        R.map(normalizeDish),
      ),
    ),
    tap(() => console.warn('DISHES PROCESSED')),
  );

export interface WaiterCallerData {
  externalId: string;
  active: boolean;
}

export const getWaiterCallerData = (
  rawData: any,
): Observable<WaiterCallerData | undefined> =>
  pipe(
    rawData?.data?.variations,
    OE.fromPredicate(
      R.complement(R.isNil),
      () => 'No variations in the rkeeper data',
    ),
    OE.chain(
      OE.fromPredicate(
        R.find((variation: any) => variation?.name === 'termék'),
        () => 'Waiter caller product not found',
      ),
    ),
    OE.chain(x => validateVariation(x[0]).pipe(oeTryCatch)),
    OE.map(variation =>
      rawData?.data?.dishes?.find(
        (dish: any) => dish.variation === variation.id,
      ),
    ),
    OE.chain(waiterCallerData =>
      validateWaiterCallerProduct(waiterCallerData).pipe(oeTryCatch),
    ),
    OE.map(dish => ({
      externalId: dish.id.toString(),
      active: !!dish.active,
    })),
    OE.getOrElse((err: string) => {
      console.warn('No waiter caller info. Reason: ', err);
      return of(undefined) as Observable<WaiterCallerData | undefined>;
    }),
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
        console.warn(
          `Found multiple items with the same clientid! ${JSON.stringify(
            items,
            null,
            2,
          )}`,
        );
      }
    }),
    map(items => items?.[0] ?? null),
  );

export const searchExternalVariant =
  (sdk: CrudSdk) =>
  (rkeeperProductGuid: string): Observable<Maybe<UnitProduct> | undefined> =>
    sdk
      .SearchVariants({
        filter: {
          externalId: {
            eq: externalProductIdMaker(rkeeperProductGuid),
          },
        },
      })
      .pipe(
        getFirstFoundItem(),
        switchMap(variant =>
          variant?.ownerProduct
            ? sdk.GetUnitProduct({ id: variant.ownerProduct })
            : of(null),
        ),
      );

export interface RKeeperBusinessEntityInfo {
  unitId: string;
}

export const getBusinessEntityInfo =
  (sdk: CrudSdk) =>
  (externalRestaurantId: string): Observable<RKeeperBusinessEntityInfo> =>
    sdk
      .SearchUnits({
        filter: { externalId: { eq: externalRestaurantId } },
      })
      .pipe(
        getFirstFoundItem(),
        throwIfEmptyValue(
          `Cannot find unit belonging to external unit id ${externalRestaurantId}`,
        ),
        map(unit => ({
          unitId: unit.id,
        })),
      );

export const createRkeeperProduct =
  (sdk: CrudSdk) =>
  (
    businessEntity: RKeeperBusinessEntityInfo,
    dish: Dish,
    configSets: ProductConfigSet[] | null,
  ) =>
    sdk.CreateUnitProduct({
      input: {
        unitId: businessEntity.unitId,
        name: {
          hu: dish.name,
        },
        productType: ProductType.dish,
        productCategoryId: defaultProductCategoryId(businessEntity),
        isVisible: true,
        position: -1,
        supportedServingModes: [ServingMode.inplace],
        variants: [
          {
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
            externalId: externalProductIdMaker(dish.id.toString()),
          },
        ],
        dirty: true,
        configSets,
        tax: -1,
      },
    });

export const updateRkeeperProduct =
  (sdk: CrudSdk) =>
  (
    dish: Dish,
    foundUnitProduct: UnitProduct,
    configSets: ProductConfigSet[] | null,
  ) =>
    forkJoin([
      sdk.UpdateUnitProduct({
        input: {
          id: foundUnitProduct.id,
          configSets,
        },
      }),
      pipe(
        foundUnitProduct.variants || [],
        R.reject(variant => R.isNil(variant)),
        R.find(variant => variant!.externalId === dish.id.toString()),
        variant =>
          variant?.id
            ? sdk.UpdateVariant({
                input: {
                  id: variant!.id,
                  variantName: {
                    hu: dish.name,
                  },
                  isAvailable: dish.active,
                  price: dish.price,
                  availabilities: [
                    {
                      type: 'A',
                      price: dish.price,
                    },
                  ],
                },
              })
            : of(false).pipe(
                tap(() =>
                  console.warn(
                    `The variant with external id ${dish.id} cannot be found. It should exist!`,
                  ),
                ),
              ),
      ),
    ]);

// This is a placeholder product category
export const defaultProductCategoryId = (businessEntityInfo: {
  unitId: string;
}) => `default-product-category-${businessEntityInfo.unitId}`;

export const createDefaultProductCategory =
  (sdk: CrudSdk) => (businessEntityInfo: RKeeperBusinessEntityInfo) =>
    sdk
      .CreateProductCategory({
        input: {
          id: defaultProductCategoryId(businessEntityInfo),
          ownerEntity: businessEntityInfo.unitId,
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

export interface Modifier {
  price: number;
  active: boolean;
  id: number;
  name: string;
}

const modifierSchema = {
  ...commonSchema,
};

export const { validate: validateModifier, isType: isModifier } =
  validateSchema<Modifier>(modifierSchema, 'Modifier', true);

export const normalizeModifier = (modifier: Modifier) =>
  normalizeCommon(modifier) as Modifier;

export const resolveComponentSets =
  (sdk: CrudSdk, unitId: string, rawData: any) =>
  (dish: Dish): OO.ObservableOption<ProductConfigSet[]> =>
    resolveComponentSetsHelper(sdk, unitId, rawData, dish);

export const handleWaiterCaller =
  (sdk: CrudSdk) =>
  (rawData: any, businessEntityInfo: RKeeperBusinessEntityInfo) =>
    getWaiterCallerData(rawData).pipe(
      switchMap(waiterCallerData =>
        waiterCallerData === undefined
          ? of(true)
          : forkJoin([
              sdk.UpdateUnit({
                input: {
                  id: businessEntityInfo.unitId,
                  canCallWaiter: waiterCallerData?.active,
                },
              }),
              sdk.UpdateUnitRKeeperData({
                input: {
                  unitId: businessEntityInfo.unitId,
                  waiterOrderId: waiterCallerData.externalId,
                },
              }),
            ]),
      ),
    );

export const handleRkeeperProducts =
  (sdk: CrudSdk) =>
  (externalRestaurantId: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (rawData: any): Observable<boolean> =>
    forkJoin([
      getBusinessEntityInfo(sdk)(externalRestaurantId),
      processDishes(rawData),
    ]).pipe(
      switchMap(([businessEntityInfo, dishes]) =>
        createDefaultProductCategory(sdk)(businessEntityInfo).pipe(
          tap(() =>
            console.log(`${dishes.length} products will be processed.`),
          ),
          switchMap(() => from(dishes)),
          mergeMap(
            dish =>
              forkJoin([
                resolveComponentSets(
                  sdk,
                  businessEntityInfo.unitId,
                  rawData,
                )(dish).pipe(
                  map(O.getOrElse<ProductConfigSet[] | null>(() => null)),
                ),
                searchExternalVariant(sdk)(dish.id.toString()),
              ]).pipe(
                switchMap(([configSets, unitProduct]) =>
                  R.isNil(unitProduct)
                    ? createRkeeperProduct(sdk)(
                        businessEntityInfo,
                        dish,
                        configSets,
                      )
                    : updateRkeeperProduct(sdk)(dish, unitProduct, configSets),
                ),
              ),
            10,
          ),
          tap(() => console.log('... a product processed')),
          count(),
          tap(i => console.log(i + ' Product processed')),
          switchMap(() => handleWaiterCaller(sdk)(rawData, businessEntityInfo)),
          tap(() => console.log('Waiter caller handled')),
          mapTo(true),
        ),
      ),
      // update waiter calling info
    );

export const upsertComponent =
  (sdk: CrudSdk, unitId: string) =>
  (modifier: Modifier): Observable<ProductConfigComponent> =>
    sdk
      .SearchProductComponents({
        filter: {
          externalId: { eq: modifier.id.toString() },
        },
      })
      .pipe(
        getFirstFoundItem<ProductComponent>(),
        switchMap(component =>
          component === null
            ? sdk.CreateProductComponent({
                input: {
                  ownerEntity: unitId,
                  name: { hu: modifier.name },
                  externalId: modifier.id.toString(),
                  dirty: true,
                },
              })
            : sdk.UpdateProductComponent({
                input: {
                  id: component.id,
                  name: {
                    hu: component.name?.hu ?? modifier.name,
                  },
                },
              }),
        ),
        throwIfEmptyValue(),
        map(component => ({
          productComponentId: component.id,
          price: modifier.price,
          position: -1,
        })),
      );

const modifierUpdaterHelper = R.memoizeWith(
  (_sdk: CrudSdk, unitId: string, modifier: Modifier) =>
    unitId + modifier.id.toString(),
  (sdk: CrudSdk, unitId: string, modifier: Modifier) =>
    pipe(upsertComponent(sdk, unitId)(modifier), shareReplay(1)),
);

export const modifierUpdater =
  (sdk: CrudSdk, unitId: string) =>
  (modifier: Modifier): Observable<ProductConfigComponent> =>
    modifierUpdaterHelper(sdk, unitId, modifier);

export interface ModifierGroup {
  id: number;
  name: string;
  modifiers: Modifier[];
  active: boolean;
}

const modifierGroupSchema = {
  id: Joi.number().required(),
  name: Joi.string().required(),
  active: Joi.number(),
  modifiers: Joi.array().required().items(modifierSchema),
};

export const { validate: validateModifierGroup, isType: isModifierGroup } =
  validateSchema<ModifierGroup>(modifierGroupSchema, 'ModifierGroup', true);

export const normalizeModifierGroup = (modifierGroup: ModifierGroup) => ({
  ...modifierGroup,
  name: decodeName(modifierGroup.name),
  modifiers: modifierGroup.modifiers.map(normalizeModifier),
});

const upsertConfigSetsHelper = R.memoizeWith(
  (_sdk: CrudSdk, unitId: string, modifierGroup: ModifierGroup) =>
    unitId + modifierGroup.id.toString(),
  (
    sdk: CrudSdk,
    unitId: string,
    modifierGroup: ModifierGroup,
  ): Observable<ProductConfigSet> =>
    pipe(
      modifierGroup.modifiers.map(modifierUpdater(sdk, unitId)),
      res => (R.isEmpty(res) ? of([]) : forkJoin(res)),
      filterNullishElements(),
      switchMap(components =>
        sdk
          .SearchProductComponentSets({
            filter: {
              externalId: { eq: modifierGroup.id.toString() },
            },
          })
          .pipe(
            getFirstFoundItem(),
            switchMap(componentSet =>
              componentSet === null
                ? sdk.CreateProductComponentSet({
                    input: {
                      externalId: modifierGroup.id.toString(),
                      ownerEntity: unitId,
                      type: ProductComponentSetType.rkeeper,
                      name: {
                        hu: modifierGroup.name,
                      },
                      description: 'describe me',
                      items: components.map(c => c.productComponentId),
                      dirty: true,
                    },
                  })
                : sdk.UpdateProductComponentSet({
                    input: {
                      id: componentSet.id,
                      name: {
                        hu: componentSet.name?.hu ?? modifierGroup.name,
                      },
                      items: components.map(c => c.productComponentId),
                    },
                  }),
            ),
            throwIfEmptyValue(),
            map(componentSet => ({
              productSetId: componentSet.id,
              items: components,
              position: -1,
            })),
          ),
      ),
      shareReplay(1),
    ),
);

export const upsertConfigSets =
  (sdk: CrudSdk, unitId: string) =>
  (modifierGroups: ModifierGroup[]): Observable<ProductConfigSet[]> =>
    R.isEmpty(modifierGroups)
      ? of([])
      : forkJoin(
          modifierGroups.map(modifierGroup =>
            upsertConfigSetsHelper(sdk, unitId, modifierGroup),
          ),
        );

export const filterActiveData = <T extends { active: boolean }>(data: T[]) =>
  data.filter(item => !!item.active);

const resolveComponentSetsHelper = R.memoizeWith(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (_sdk: CrudSdk, unitId: string, _rawData: any, dish: Dish) =>
    unitId + (dish.modischeme ?? -1).toString(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (sdk: CrudSdk, unitId: string, rawData: any, dish: Dish) =>
    pipe(
      rawData?.data?.modifiers,
      O.fromPredicate(() => !!rawData?.data?.modifiers && !!dish.modischeme),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      O.map(R.find((item: any) => item?.id === dish.modischeme)),
      O.chain(O.fromNullable),
      O.chain(modischema => O.fromNullable(modischema.group)),
      O.map(
        flow(
          R.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (modifierGroupItem: any): ModifierGroup => ({
              id: modifierGroupItem.id,
              name: modifierGroupItem.name,
              active: modifierGroupItem.active,
              modifiers: pipe(
                modifierGroupItem?.modi ?? [],
                R.map(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (modifier: any) => ({
                    price: modifier?.price,
                    name: modifier.name,
                    active: modifier.active,
                    id: modifier.id,
                  }),
                ),
              ),
            }),
          ),
        ),
      ),
      OO.fromOption,
      OO.chain(
        flow(
          filterActiveData,
          R.map(item =>
            validateModifierGroup(item).pipe(
              map(
                flow(normalizeModifierGroup, modifierGroup => ({
                  ...modifierGroup,
                  modifiers: filterActiveData(modifierGroup.modifiers),
                })),
              ),
            ),
          ),
          (modifierGroups: Observable<ModifierGroup>[]) =>
            R.isEmpty(modifierGroups) ? of([]) : forkJoin(modifierGroups),
          switchMap(upsertConfigSets(sdk, unitId)),
          catchError(err => {
            console.warn(
              `Found an invalid record. The problem: (${JSON.stringify(
                err,
                null,
                2,
              )})`,
            );
            return of(null);
          }),
          OO.fromObservable,
        ),
      ),
      OO.chain(x => (x ? OO.some(x) : OO.none)),
    ),
);
