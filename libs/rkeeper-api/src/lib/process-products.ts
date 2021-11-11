import * as OO from 'fp-ts-rxjs/ObservableOption';
import { unitRequestHandler } from '@bgap/anyupp-gql/backend';
import { flow, pipe } from 'fp-ts/lib/function';
import * as R from 'ramda';
import * as O from 'fp-ts/lib/Option';
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
  shareReplay,
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
  filterNullishElements,
  filterNullishGraphqlListWithDefault,
  throwIfEmptyValue,
} from '@bgap/shared/utils';

// make sure that everything gets (re)indexed
const ES_DELAY = 5000; //ms

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
  chain: CrudApi.UpdateChainProductInput;
  unit: CrudApi.UpdateUnitProductInput;
  group: CrudApi.UpdateGroupProductInput;
}

export interface Dish {
  price: number;
  active: boolean;
  id: number;
  guid: string;
  name: string;
  modischeme?: number;
}

const dishSchema = {
  ...commonSchema,
  guid: Joi.string().required(),
  modischeme: Joi.number().integer(),
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
    map(items => items?.[0] ?? null),
  );

export const searchExternalUnitProduct =
  (sdk: CrudApi.CrudSdk) =>
  (
    rkeeperProductGuid: string,
  ): Observable<CrudApi.Maybe<CrudApi.UnitProduct>> =>
    sdk
      .SearchUnitProducts({
        filter: {
          externalId: {
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
        filter: { externalId: { eq: externalRestaurantId } },
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
  (
    businessEntity: RKeeperBusinessEntityInfo,
    dish: Dish,
    configSets: CrudApi.ProductConfigSet[] | null,
  ) =>
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
              externalId: externalProductIdMaker(dish.guid),
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
              configSets,
            },
          }),
        ),
      );

export const updateRkeeperProduct =
  (sdk: CrudApi.CrudSdk) =>
  (
    dish: Dish,
    foundUnitProduct: CrudApi.UnitProduct,
    configSets: CrudApi.ProductConfigSet[] | null,
  ) =>
    sdk.UpdateUnitProduct({
      input: {
        id: foundUnitProduct.id,
        isVisible: dish.active,
        configSets,
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
              combineLatest(
                resolveComponentSets(
                  sdk,
                  businessEntityInfo.chainId,
                  rawData,
                )(dish).pipe(
                  map(
                    O.getOrElse<CrudApi.ProductConfigSet[] | null>(() => null),
                  ),
                ),
                searchExternalUnitProduct(sdk)(dish.guid),
              ).pipe(
                switchMap(([configSets, unitProduct]) =>
                  unitProduct === null
                    ? createRkeeperProduct(sdk)(
                        businessEntityInfo,
                        dish,
                        configSets,
                      )
                    : updateRkeeperProduct(sdk)(dish, unitProduct, configSets),
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

export const upsertComponent =
  (sdk: CrudApi.CrudSdk, chainId: string) =>
  (modifier: Modifier): Observable<CrudApi.ProductConfigComponent> =>
    sdk
      .SearchProductComponents({
        filter: {
          externalId: { eq: modifier.id.toString() },
        },
      })
      .pipe(
        getFirstFoundItem<CrudApi.ProductComponent>(),
        switchMap(component =>
          component === null
            ? sdk.CreateProductComponent({
                input: {
                  chainId,
                  name: { hu: modifier.name },
                  externalId: modifier.id.toString(),
                },
              })
            : sdk.UpdateProductComponent({
                input: {
                  id: component.id,
                  name: {
                    hu: modifier.name,
                  },
                },
              }),
        ),
        throwIfEmptyValue(),
        map(component => ({
          productComponentId: component.id,
          refGroupPrice: modifier.price,
          price: modifier.price,
          position: -1,
        })),
      );

const modifierUpdaterHelper = R.memoizeWith(
  (_sdk: CrudApi.CrudSdk, chainId: string, modifier: Modifier) =>
    chainId + modifier.id.toString(),
  (sdk: CrudApi.CrudSdk, chainId: string, modifier: Modifier) =>
    pipe(upsertComponent(sdk, chainId)(modifier), shareReplay(1)),
);

export const modifierUpdater =
  (sdk: CrudApi.CrudSdk, chainId: string) =>
  (modifier: Modifier): Observable<CrudApi.ProductConfigComponent> =>
    modifierUpdaterHelper(sdk, chainId, modifier);

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
  (_sdk: CrudApi.CrudSdk, chainId: string, modifierGroup: ModifierGroup) =>
    chainId + modifierGroup.id.toString(),
  (sdk: CrudApi.CrudSdk, chainId: string, modifierGroup: ModifierGroup) =>
    pipe(
      modifierGroup.modifiers.map(modifierUpdater(sdk, chainId)),
      res => (R.isEmpty(res) ? of([]) : combineLatest(res)),
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
                      chainId,
                      type: 'rkeeper',
                      name: {
                        hu: modifierGroup.name,
                      },
                      description: 'describe me',
                      items: components.map(c => c.productComponentId),
                    },
                  })
                : sdk.UpdateProductComponentSet({
                    input: {
                      id: componentSet.id,
                      name: {
                        hu: modifierGroup.name,
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
  (sdk: CrudApi.CrudSdk, chainId: string) =>
  (modifierGroups: ModifierGroup[]): Observable<CrudApi.ProductConfigSet[]> =>
    combineLatest(
      modifierGroups.map(modifierGroup =>
        upsertConfigSetsHelper(sdk, chainId, modifierGroup),
      ),
    );

export const filterActiveData = <T extends { active: boolean }>(data: T[]) =>
  data.filter(item => !!item.active);

const resolveComponentSetsHelper = R.memoizeWith(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (_sdk: CrudApi.CrudSdk, chainId: string, _rawData: any, dish: Dish) =>
    chainId + (dish.modischeme ?? -1).toString(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (sdk: CrudApi.CrudSdk, chainId: string, rawData: any, dish: Dish) =>
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
          modifiers =>
            R.isEmpty(modifiers) ? of([]) : combineLatest(modifiers),
          switchMap(upsertConfigSets(sdk, chainId)),
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

export const resolveComponentSets =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any


    (sdk: CrudApi.CrudSdk, chainId: string, rawData: any) =>
    (dish: Dish): OO.ObservableOption<CrudApi.ProductConfigSet[]> =>
      resolveComponentSetsHelper(sdk, chainId, rawData, dish);
