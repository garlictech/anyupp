import {
  chainFixture,
  groupFixture,
  productCategoryFixture,
  productComponentSetFixture,
  productSnapshotFixture,
  seededIdPrefix,
  unitFixture,
} from '@bgap/shared/fixtures';
import { RequiredId } from '@bgap/shared/types';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { pipe } from 'fp-ts/lib/function';
import { CrudSdk } from '@bgap/crud-gql/api';
import {
  Allergen,
  CreateAdminUserInput,
  CreateChainInput,
  CreateChainProductInput,
  CreateGroupInput,
  CreateGroupProductInput,
  CreateOrderInput,
  CreateProductCategoryInput,
  CreateProductComponentInput,
  CreateProductComponentSetInput,
  CreateTransactionInput,
  CreateUnitInput,
  CreateUnitProductInput,
  CreateUserInput,
  OrderMode,
  OrderStatus,
  PaymentMethod,
  PaymentType,
  PosType,
  ProductType,
  ServingMode,
  UnitMapObjectType,
} from '@bgap/domain';
import { DateTime } from 'luxon';
import * as R from 'ramda';
import { combineLatest, from, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, switchMap, tap, toArray } from 'rxjs/operators';
import { seedUtils } from './utils';

export interface SeederDependencies {
  crudSdk: CrudSdk;
  userPoolId: string;
  consumerUserPoolId: string;
  cognitoidentityserviceprovider: CognitoIdentityServiceProvider;
}

export type DeletableInput<T> = Omit<T, 'id'> & { id: string };

const deleteCreate = <T, K>(
  deleteOperation: () => Observable<T>,
  createOperation: () => Observable<K>,
): Observable<K> =>
  deleteOperation().pipe(
    catchError(error => {
      console.warn('Problem with SEED data DELETION: ', error);
      return of('STILL TRY TO CREATE IT PLEASE');
    }),
    switchMap(() => createOperation()),
  );

export const createConsumerUser = () => (deps: SeederDependencies) => {
  console.debug('createConsumerUser');

  const input: CreateUserInput = {
    id: 'test-alice',
    name: 'Mekk Elek',
    email: 'testuser+alice@anyupp.com',
    phone: '1234',
  };
  return deleteCreate(
    () => deps.crudSdk.DeleteUser({ input: { id: input.id ?? '' } }),
    () => deps.crudSdk.CreateUser({ input }),
  );
};

export const createTestChain =
  (chainIdx: number) => (deps: SeederDependencies) => {
    console.debug('createTestChain', {
      chainIdx,
    });
    const input: CreateChainInput = {
      ...chainFixture.chainBase,
      id: seedUtils.generateChainId(chainIdx),
      name: `Rab lánc #${chainIdx}`,
    };
    return deleteCreate(
      () => deps.crudSdk.DeleteChain({ input: { id: input.id ?? '' } }),
      () => deps.crudSdk.CreateChain({ input }),
    );
  };

export const createTestGroup =
  (chainIdx: number, groupIdx: number) => (deps: SeederDependencies) => {
    console.debug('createTestGroup', {
      chainIdx,
      groupIdx,
    });
    const input: CreateGroupInput = {
      ...groupFixture.groupBase,
      id: seedUtils.generateGroupId(chainIdx, groupIdx),
      chainId: seedUtils.generateChainId(chainIdx),
      name: `Nagy csoport #${groupIdx}`,
      // currency: groupIdx % 2 === 0 ? 'HUF' : 'EUR',
      currency: 'HUF',
    };
    return deleteCreate(
      () => deps.crudSdk.DeleteGroup({ input: { id: input.id ?? '' } }),
      () => deps.crudSdk.CreateGroup({ input }),
    );
  };

export const createAdminUser =
  (adminUserId: string, email: string, phone: string) =>
  (deps: SeederDependencies) => {
    console.debug('createAdminUser', {
      adminUserId,
      email,
    });
    const input: DeletableInput<CreateAdminUserInput> = {
      id: adminUserId,
      name: adminUserId,
      email,
      phone,
      profileImage:
        'https://ocdn.eu/pulscms-transforms/1/-rxktkpTURBXy9jMzIxNGM4NWI2NmEzYTAzMjkwMTQ1NGMwZmQ1MDE3ZS5wbmeSlQMAAM0DFM0Bu5UCzQSwAMLD',
    };
    return deleteCreate(
      () => deps.crudSdk.DeleteAdminUser({ input: { id: input.id ?? '' } }),
      () => deps.crudSdk.CreateAdminUser({ input }),
    );
  };

export const createTestUnit =
  (chainIdx: number, groupIdx: number, unitIdx: number) =>
  (deps: SeederDependencies) => {
    console.debug('createTestUnit', {
      chainIdx,
      groupIdx,
      unitIdx,
    });
    const input: CreateUnitInput = {
      ...R.omit(['createdAt', 'updatedAt'], unitFixture.unitBase),
      id: seedUtils.generateUnitId(chainIdx, groupIdx, unitIdx),
      groupId: seedUtils.generateGroupId(chainIdx, groupIdx),
      chainId: seedUtils.generateChainId(chainIdx),
      name: `Késdobáló #${chainIdx}${groupIdx}${unitIdx}`,
      timeZone: 'Europe/Budapest',
      supportedServingModes:
        unitIdx % 2 === 1
          ? unitFixture.unitBase.supportedServingModes
          : [ServingMode.inplace],
      supportedOrderModes:
        unitIdx % 2 === 1
          ? unitFixture.unitBase.supportedOrderModes
          : [OrderMode.instant],
      lanes: [
        {
          color: '#e72222',
          id: 'lane_01',
          name: 'bár',
        },
        {
          color: '#e123ef',
          id: 'lane_02',
          name: 'konyha',
        },
      ],
      openingHours: {
        mon: {
          from: '09:00',
          to: '17:00',
        },
        tue: {
          from: '09:00',
          to: '18:00',
        },
        wed: {
          from: '09:00',
          to: '19:00',
        },
        thu: {
          from: '09:00',
          to: '20:00',
        },
        fri: {
          from: '09:00',
          to: '21:00',
        },
        sat: {
          from: '',
          to: '',
        },
        sun: {
          from: '',
          to: '',
        },
        custom: [],
      },
      floorMap: {
        w: 800,
        h: 300,
        objects: [
          {
            id: 'caxj47xzn7n',
            t: UnitMapObjectType.table_r,
            c: '01',
            w: 150,
            h: 60,
            r: null,
            a: 0,
            x: 10,
            y: 10,
            tID: '01',
            sID: null,
          },
          {
            id: 'f87azndb8ct',
            t: UnitMapObjectType.table_r,
            c: '03',
            w: 150,
            h: 60,
            r: null,
            a: 0,
            x: 376,
            y: 10,
            tID: '03',
            sID: null,
          },
          {
            id: 'cyh9qwe2axr',
            t: UnitMapObjectType.table_r,
            c: '02',
            w: 150,
            h: 60,
            r: null,
            a: 0,
            x: 192,
            y: 10,
            tID: '02',
            sID: null,
          },
          {
            id: 'ufegqdtf82h',
            t: UnitMapObjectType.seat_r,
            x: 20,
            y: 60,
            c: '01',
            a: 0,
            w: 30,
            h: 30,
            tID: '01',
            sID: '01',
          },
          {
            id: 'eohk3z8f9oq',
            t: UnitMapObjectType.seat_r,
            x: 68,
            y: 60,
            c: '02',
            a: 0,
            w: 30,
            h: 30,
            tID: '01',
            sID: '02',
          },
          {
            id: 'l4i62x7idpo',
            t: UnitMapObjectType.seat_r,
            x: 116,
            y: 60,
            c: '03',
            a: 0,
            w: 30,
            h: 30,
            tID: '01',
            sID: '03',
          },
          {
            id: 'nlqoylp88p9',
            t: UnitMapObjectType.seat_r,
            x: 206,
            y: 60,
            c: '01',
            a: 0,
            w: 30,
            h: 30,
            tID: '02',
            sID: '01',
          },
          {
            id: 'mxo7tnz53sh',
            t: UnitMapObjectType.seat_r,
            x: 254,
            y: 60,
            c: '02',
            a: 0,
            w: 30,
            h: 30,
            tID: '02',
            sID: '02',
          },
          {
            id: 'temzt4yr0uc',
            t: UnitMapObjectType.seat_r,
            x: 300,
            y: 60,
            c: '03',
            a: 0,
            w: 30,
            h: 30,
            tID: '02',
            sID: '03',
          },
          {
            id: '7r01h7bl7j2',
            t: UnitMapObjectType.seat_r,
            x: 386,
            y: 60,
            c: '01',
            a: 0,
            w: 30,
            h: 30,
            tID: '03',
            sID: '01',
          },
          {
            id: 't767czui7oj',
            t: UnitMapObjectType.seat_r,
            x: 436,
            y: 60,
            c: '02',
            a: 0,
            w: 30,
            h: 30,
            tID: '03',
            sID: '02',
          },
          {
            id: 'w6hsmjl8jo',
            t: UnitMapObjectType.seat_r,
            x: 484,
            y: 60,
            c: '03',
            a: 0,
            w: 30,
            h: 30,
            tID: '03',
            sID: '03',
          },
        ],
      },
    };
    return deleteCreate(
      () => deps.crudSdk.DeleteUnit({ input: { id: input.id ?? '' } }),
      () => deps.crudSdk.CreateUnit({ input }),
    );
  };

export const createTestUnitsForOrderHandling =
  () => (deps: SeederDependencies) => {
    console.debug('createTestUnitForOrderhandling', {});

    return pipe(
      [
        unitFixture.unitInstantInplace,
        unitFixture.unitInstantTakeaway,
        unitFixture.unitPickupInplace,
        unitFixture.unitPickupTakeaway,
      ],
      R.map(unit => ({
        ...unit,
        groupId: seedUtils.generateGroupId(1, 1),
        chainId: seedUtils.generateChainId(1),
      })),
      R.map(input =>
        deleteCreate(
          () => deps.crudSdk.DeleteUnit({ input: { id: input.id ?? '' } }),
          () => deps.crudSdk.CreateUnit({ input }),
        ),
      ),
      combineLatest,
    );
  };

export const createTestProductCategory =
  (chainIdx: number, productCategoryId: number) =>
  (deps: SeederDependencies) => {
    console.debug('createTestProductCategory', {
      chainIdx,
      productCategoryId,
    });

    const input: DeletableInput<CreateProductCategoryInput> = {
      id: seedUtils.generateProductCategoryId(chainIdx, productCategoryId),
      chainId: seedUtils.generateChainId(chainIdx),
      name: {
        hu: `Teszt termék kategória #${productCategoryId}`,
        en: `Test product category #${productCategoryId}`,
      },
      description: {
        hu: `Teszt termék kategória #${productCategoryId} leírása`,
        en: `Test product category #${productCategoryId} description`,
      },
      position: productCategoryId,
      image: 'https://picsum.photos/100',
    };

    return deleteCreate(
      () =>
        deps.crudSdk.DeleteProductCategory({ input: { id: input.id ?? '' } }),
      () => deps.crudSdk.CreateProductCategory({ input }),
    );
  };

export const createTestProductCategoryFromFixtures =
  () => (deps: SeederDependencies) => {
    console.debug('createTestProductCategoryFromFixtures');

    return deleteCreate(
      () =>
        deps.crudSdk.DeleteProductCategory({
          input: { id: productCategoryFixture.seededProductCategory_01.id },
        }),
      () =>
        deps.crudSdk.CreateProductCategory({
          input: productCategoryFixture.seededProductCategory_01,
        }),
    ).pipe(
      switchMap(() =>
        deleteCreate(
          () =>
            deps.crudSdk.DeleteProductCategory({
              input: { id: productCategoryFixture.seededProductCategory_02.id },
            }),
          () =>
            deps.crudSdk.CreateProductCategory({
              input: productCategoryFixture.seededProductCategory_02,
            }),
        ),
      ),
      switchMap(() =>
        deleteCreate(
          () =>
            deps.crudSdk.DeleteProductCategory({
              input: { id: productCategoryFixture.seededProductCategory_03.id },
            }),
          () =>
            deps.crudSdk.CreateProductCategory({
              input: productCategoryFixture.seededProductCategory_03,
            }),
        ),
      ),
    );
  };

export const createChainProductsFromSnapshot = (deps: SeederDependencies) => {
  const deleteCreateChainProduct = (input: CreateChainProductInput) =>
    deleteCreate(
      () => deps.crudSdk.DeleteChainProduct({ input: { id: input.id ?? '' } }),
      () => deps.crudSdk.CreateChainProduct({ input }),
    );

  return combineLatest([
    deleteCreateChainProduct(productSnapshotFixture.chainProduct_1),
    deleteCreateChainProduct(productSnapshotFixture.chainProduct_2),
    deleteCreateChainProduct(productSnapshotFixture.chainProduct_3),
    deleteCreateChainProduct(productSnapshotFixture.chainProduct_4),
    deleteCreateChainProduct(productSnapshotFixture.chainProduct_5),
    deleteCreateChainProduct(productSnapshotFixture.chainProduct_6),
    deleteCreateChainProduct(productSnapshotFixture.chainProduct_7),
    deleteCreateChainProduct(productSnapshotFixture.chainProduct_8),
    deleteCreateChainProduct(productSnapshotFixture.chainProduct_9),
    deleteCreateChainProduct(productSnapshotFixture.chainProduct_10),
    deleteCreateChainProduct(productSnapshotFixture.chainProduct_11),
    deleteCreateChainProduct(productSnapshotFixture.chainProduct_12),
    deleteCreateChainProduct(productSnapshotFixture.chainProduct_13),
    deleteCreateChainProduct(productSnapshotFixture.chainProduct_14),
    deleteCreateChainProduct(productSnapshotFixture.chainProduct_15),
  ]);
};

export const createGroupProductsFromSnapshot = (deps: SeederDependencies) => {
  const deleteCreateGroupProduct = (input: CreateGroupProductInput) =>
    deleteCreate(
      () => deps.crudSdk.DeleteGroupProduct({ input: { id: input.id ?? '' } }),
      () => deps.crudSdk.CreateGroupProduct({ input }),
    );

  return combineLatest([
    deleteCreateGroupProduct(productSnapshotFixture.groupProduct_1),
    deleteCreateGroupProduct(productSnapshotFixture.groupProduct_2),
    deleteCreateGroupProduct(productSnapshotFixture.groupProduct_3),
    deleteCreateGroupProduct(productSnapshotFixture.groupProduct_4),
    deleteCreateGroupProduct(productSnapshotFixture.groupProduct_5),
    deleteCreateGroupProduct(productSnapshotFixture.groupProduct_6),
    deleteCreateGroupProduct(productSnapshotFixture.groupProduct_7),
    deleteCreateGroupProduct(productSnapshotFixture.groupProduct_8),
    deleteCreateGroupProduct(productSnapshotFixture.groupProduct_9),
    deleteCreateGroupProduct(productSnapshotFixture.groupProduct_10),
    deleteCreateGroupProduct(productSnapshotFixture.groupProduct_11),
    deleteCreateGroupProduct(productSnapshotFixture.groupProduct_12),
    deleteCreateGroupProduct(productSnapshotFixture.groupProduct_13),
    deleteCreateGroupProduct(productSnapshotFixture.groupProduct_14),
    deleteCreateGroupProduct(productSnapshotFixture.groupProduct_15),
  ]);
};

export const createUnitProductsFromSnapshot = (deps: SeederDependencies) => {
  const deleteCreateUnitProduct = (input: CreateUnitProductInput) =>
    deleteCreate(
      () => deps.crudSdk.DeleteUnitProduct({ input: { id: input.id ?? '' } }),
      () => deps.crudSdk.CreateUnitProduct({ input }),
    );

  return combineLatest([
    deleteCreateUnitProduct(productSnapshotFixture.unitProduct_1),
    deleteCreateUnitProduct(productSnapshotFixture.unitProduct_2),
    deleteCreateUnitProduct(productSnapshotFixture.unitProduct_3),
    deleteCreateUnitProduct(productSnapshotFixture.unitProduct_4),
    deleteCreateUnitProduct(productSnapshotFixture.unitProduct_5),
    deleteCreateUnitProduct(productSnapshotFixture.unitProduct_6),
    deleteCreateUnitProduct(productSnapshotFixture.unitProduct_7),
    deleteCreateUnitProduct(productSnapshotFixture.unitProduct_8),
    deleteCreateUnitProduct(productSnapshotFixture.unitProduct_9),
    deleteCreateUnitProduct(productSnapshotFixture.unitProduct_10),
    deleteCreateUnitProduct(productSnapshotFixture.unitProduct_11),
    deleteCreateUnitProduct(productSnapshotFixture.unitProduct_12),
    deleteCreateUnitProduct(productSnapshotFixture.unitProduct_13),
    deleteCreateUnitProduct(productSnapshotFixture.unitProduct_14),
    deleteCreateUnitProduct(productSnapshotFixture.unitProduct_15),
  ]);
};

export const createTestChainProduct =
  (
    chainIdx: number,
    productCategoryIdx: number,
    productIdx: number,
    productName: string,
    productType: ProductType,
  ) =>
  (deps: SeederDependencies) => {
    console.debug('createTestChainProduct', {
      chainIdx,
      productCategoryIdx,
      productIdx,
      productName,
      productType,
    });
    const input: DeletableInput<CreateChainProductInput> = {
      id: seedUtils.generateChainProductId(chainIdx, productIdx),
      chainId: seedUtils.generateChainId(chainIdx),
      name: {
        hu: `${productName} #${productIdx}`,
        en: `${productName} #${productIdx}`,
      },
      description: {
        hu: `${productName} #${productIdx} leírás`,
        en: `${productName} #${productIdx} description`,
      },
      productCategoryId: seedUtils.generateProductCategoryId(
        chainIdx,
        productCategoryIdx,
      ),
      productType,
      isVisible: true,
      variants: [
        {
          id: seedUtils.generateVariantId(chainIdx, productIdx, 1, 'chain'),
          isAvailable: true,
          position: 10,
          price: 11,
          pack: {
            size: 2,
            unit: 'dl',
          },
          variantName: {
            en: 'glass',
            hu: 'pohár',
          },
        },
      ],
      image: 'https://picsum.photos/200',
      allergens: [Allergen.egg, Allergen.gluten, Allergen.peanut],
      // Use existing ProductComponentSet
      configSets: productComponentSetFixture.seededChainProductConfigSets,
    };
    return deleteCreate(
      () => deps.crudSdk.DeleteChainProduct({ input: { id: input.id ?? '' } }),
      () => deps.crudSdk.CreateChainProduct({ input }),
    );
  };

export const createTestGroupProduct =
  (
    chainIdx: number,
    groupIdx: number,
    chainProductIdx: number,
    productIdx: number,
  ) =>
  (deps: SeederDependencies) => {
    console.debug('createTestGroupProduct', {
      chainIdx,
      groupIdx,
      chainProductIdx,
      productIdx,
    });
    const input: DeletableInput<CreateGroupProductInput> = {
      id: seedUtils.generateGroupProductId(chainIdx, groupIdx, productIdx),
      parentId: seedUtils.generateChainProductId(chainIdx, chainProductIdx),
      chainId: seedUtils.generateChainId(chainIdx),
      groupId: seedUtils.generateGroupId(chainIdx, groupIdx),
      isVisible: true,
      tax: 27,
      variants: [
        {
          id: seedUtils.generateVariantId(chainIdx, productIdx, 1, 'group'),
          isAvailable: true,
          price: 11,
          position: 10,
          pack: {
            size: 2,
            unit: 'dl',
          },
          variantName: {
            en: 'glass',
            hu: 'pohár',
          },
          refGroupPrice: productIdx * 50,
        },
      ],
      configSets: productComponentSetFixture.seededGroupProductConfigSets,
    };
    return deleteCreate(
      () => deps.crudSdk.DeleteGroupProduct({ input: { id: input.id ?? '' } }),
      () => deps.crudSdk.CreateGroupProduct({ input }),
    );
  };

/**
 * Create UnitProduct and GeneratedProducts too
 */
export const createTestUnitProduct =
  (
    chainIdx: number,
    groupIdx: number,
    unitIdx: number,
    groupProductIdx: number,
    productIdx: number,
  ) =>
  (deps: SeederDependencies) => {
    console.debug('createTestUnitProduct', {
      chainIdx,
      groupIdx,
      unitIdx,
      groupProductIdx,
      productIdx,
    });
    const input: DeletableInput<CreateUnitProductInput> = {
      id: seedUtils.generateUnitProductId(chainIdx, groupIdx, productIdx),
      parentId: seedUtils.generateGroupProductId(
        chainIdx,
        groupIdx,
        groupProductIdx,
      ),
      chainId: seedUtils.generateChainId(chainIdx),
      groupId: seedUtils.generateGroupId(chainIdx, groupIdx),
      unitId: seedUtils.generateUnitId(chainIdx, groupIdx, unitIdx),
      laneId: 'lane_01',
      isVisible: true,
      takeaway: false,
      supportedServingModes: [ServingMode.takeaway],
      position: productIdx,
      variants: [
        {
          id: seedUtils.generateVariantId(chainIdx, productIdx, 1, 'unit'),
          isAvailable: true,
          price: 150,
          position: 1,
          pack: {
            size: 2,
            unit: 'dl',
          },
          variantName: {
            en: 'glass',
            hu: 'pohár',
          },
          availabilities: [
            {
              dayFrom: '',
              dayTo: '',
              price: productIdx * 150,
              timeFrom: '',
              timeTo: '',
              type: 'A',
            },
          ],
        },
      ],
      configSets: productComponentSetFixture.seededUnitProductConfigSets,
    };
    return deleteCreate(
      () => deps.crudSdk.DeleteUnitProduct({ input: { id: input.id ?? '' } }),
      () => deps.crudSdk.CreateUnitProduct({ input }),
    );
  };

export const createTestOrder =
  ({
    chainIdx,
    groupIdx,
    unitIdx,
    productIdx,
    userIdx,
    orderIdx,
  }: {
    chainIdx: number;
    groupIdx: number;
    unitIdx: number;
    productIdx: number;
    userIdx: number;
    orderIdx: number;
  }) =>
  (deps: SeederDependencies) => {
    console.debug('createTestOrder', {
      chainIdx,
      groupIdx,
      unitIdx,
      productIdx,
      userIdx,
      orderIdx,
    });
    const input: DeletableInput<CreateOrderInput> = {
      id: seedUtils.generateOrderId(orderIdx),
      userId: seedUtils.generateUserId(userIdx),
      unitId: seedUtils.generateUnitId(chainIdx, groupIdx, unitIdx),
      paymentMode: {
        type: PaymentType.stripe,
        method: PaymentMethod.inapp,
      },
      takeAway: false,
      orderMode: OrderMode.pickup,
      servingMode: ServingMode.takeaway,
      archived: false,
      place: {
        seat: '00',
        table: '70',
      },
      sumPriceShown: {
        currency: 'HUF',
        pricePerUnit: 0,
        priceSum: 700,
        tax: 0, // empty
        taxSum: 0, // empty
      },
      paymentIntention: 0,
      items: [
        {
          productName: {
            en: 'Water',
            hu: 'Viz',
          },
          priceShown: {
            currency: 'HUF',
            pricePerUnit: 350,
            priceSum: 700,
            tax: 27, // empty
            taxSum: 149, // empty
          },
          sumPriceShown: {
            currency: 'HUF',
            pricePerUnit: 350,
            priceSum: 700,
            tax: 27, // empty
            taxSum: 149, // empty
          },
          productId: seedUtils.generateUnitProductId(
            chainIdx,
            groupIdx,
            productIdx,
          ),
          quantity: 2,
          variantId: seedUtils.generateVariantId(
            chainIdx,
            productIdx,
            1,
            'unit',
          ),
          variantName: {
            en: 'glass',
            hu: 'pohár',
          },
          laneId: 'lane_01',
          image: 'https://picsum.photos/100',
          statusLog: [
            {
              userId: seedUtils.generateUserId(userIdx),
              status: OrderStatus.none,
              ts: DateTime.utc().toMillis(),
            },
          ],
          productType: ProductType.drink,
        },
      ],
    };
    return deleteCreate(
      () => deps.crudSdk.DeleteOrder({ input: { id: input.id ?? '' } }),
      () => deps.crudSdk.CreateOrder({ input }),
    );
  };

export const createComponentSets = (deps: SeederDependencies) => {
  console.debug('createComponentSets - 3 components and 2 component sets');

  const deleteCreateProductComponent = (
    comp: RequiredId<CreateProductComponentInput>,
  ) =>
    deleteCreate(
      () =>
        deps.crudSdk.DeleteProductComponent({
          input: { id: comp.id },
        }),
      () =>
        deps.crudSdk.CreateProductComponent({
          input: comp,
        }),
    );

  const deleteCreateProductComponentSet = (
    compSet: RequiredId<CreateProductComponentSetInput>,
  ) =>
    deleteCreate(
      () =>
        deps.crudSdk.DeleteProductComponentSet({
          input: { id: compSet.id },
        }),
      () =>
        deps.crudSdk.CreateProductComponentSet({
          input: compSet,
        }),
    );

  return deleteCreateProductComponent(
    productComponentSetFixture.seededProdComp_11,
  ).pipe(
    switchMap(() =>
      deleteCreateProductComponent(
        productComponentSetFixture.seededProdComp_12,
      ),
    ),
    switchMap(() =>
      deleteCreateProductComponent(
        productComponentSetFixture.seededProdComp_21,
      ),
    ),
    switchMap(() =>
      deleteCreateProductComponent(
        productComponentSetFixture.seededProdComp_22,
      ),
    ),
    switchMap(() =>
      deleteCreateProductComponent(
        productComponentSetFixture.seededProdComp_31,
      ),
    ),
    switchMap(() =>
      deleteCreateProductComponent(
        productComponentSetFixture.seededProdComp_32,
      ),
    ),
    switchMap(() =>
      deleteCreateProductComponent(
        productComponentSetFixture.seededProdComp_33,
      ),
    ),
    switchMap(() =>
      deleteCreateProductComponentSet(
        productComponentSetFixture.seededProdCompSet_01,
      ),
    ),
    switchMap(() =>
      deleteCreateProductComponentSet(
        productComponentSetFixture.seededProdCompSet_02,
      ),
    ),
    switchMap(() =>
      deleteCreateProductComponentSet(
        productComponentSetFixture.seededProdCompSet_03,
      ),
    ),
  );
};

export const seedSportbarRKeeperUnit = (deps: SeederDependencies) =>
  combineLatest(
    deleteCreate(
      () => deps.crudSdk.DeleteUnit({ input: { id: 'sportbar-rkeeper-unit' } }),
      () =>
        deps.crudSdk.CreateUnit({
          input: {
            ...unitFixture.createRkeeperUnit,
            id: 'sportbar-rkeeper-unit',
            name: `sportbar RKEEPER unit`,
            supportedOrderModes: [OrderMode.pickup],
            supportedServingModes: [ServingMode.inplace, ServingMode.takeaway],
            externalId: '170880001',
            groupId: 'sportbar-rkeeper-group',
            chainId: 'sportbar-rkeeper-chain',
            pos: {
              type: PosType.rkeeper,
              rkeeper: {
                endpointUri: 'https://testendpoint.ucs.hu/wp-json/vendor/v1',
                rkeeperUsername: '350_55_64_458',
                rkeeperPassword: 'd192bf79e9cbeb655a8fc60de86322',
                anyuppPassword: 'foobar',
                anyuppUsername: 'foobar',
              },
            },
          },
        }),
    ),

    deleteCreate(
      () =>
        deps.crudSdk.DeleteGroup({ input: { id: 'sportbar-rkeeper-group' } }),
      () =>
        deps.crudSdk.CreateGroup({
          input: {
            ...groupFixture.group_01,
            id: 'sportbar-rkeeper-group',
            name: 'sportbar RKEEPER Group',
            chainId: 'sportbar-rkeeper-chain',
          },
        }),
    ),

    deleteCreate(
      () =>
        deps.crudSdk.DeleteChain({ input: { id: 'sportbar-rkeeper-chain' } }),
      () =>
        deps.crudSdk.CreateChain({
          input: {
            ...chainFixture.chain_01,
            id: 'sportbar-rkeeper-chain',
            name: 'sportbar RKEEPER Chain',
          },
        }),
    ),
  );

export const seedYellowRKeeperUnit = (deps: SeederDependencies) =>
  combineLatest(
    deleteCreate(
      () => deps.crudSdk.DeleteUnit({ input: { id: 'yellow-rkeeper-unit' } }),
      () =>
        deps.crudSdk.CreateUnit({
          input: {
            ...unitFixture.createRkeeperUnit,
            id: 'yellow-rkeeper-unit',
            name: `yellow RKEEPER unit`,
            supportedOrderModes: [OrderMode.pickup, OrderMode.instant],
            supportedServingModes: [ServingMode.takeaway, ServingMode.inplace],
            externalId: '109150001',
            groupId: 'yellow-rkeeper-group',
            chainId: 'yellow-rkeeper-chain',
            pos: {
              type: PosType.rkeeper,
              rkeeper: {
                endpointUri: 'https://testendpoint.ucs.hu/wp-json/vendor/v1',
                rkeeperUsername: '795_50_155_539',
                rkeeperPassword: 'b6302d53085c9486d0f765ec475f18',
                anyuppPassword: 'foobar',
                anyuppUsername: 'foobar',
              },
            },
          },
        }),
    ),
    deleteCreate(
      () => deps.crudSdk.DeleteGroup({ input: { id: 'yellow-rkeeper-group' } }),
      () =>
        deps.crudSdk.CreateGroup({
          input: {
            ...groupFixture.group_01,
            id: 'yellow-rkeeper-group',
            name: 'yellow RKEEPER Group',
            chainId: 'yellow-rkeeper-chain',
          },
        }),
    ),
    deleteCreate(
      () => deps.crudSdk.DeleteChain({ input: { id: 'yellow-rkeeper-chain' } }),
      () =>
        deps.crudSdk.CreateChain({
          input: {
            ...chainFixture.chain_01,
            id: 'yellow-rkeeper-chain',
            name: 'yellow RKEEPER Chain',
          },
        }),
    ),
  );

export const placeOrderToSeat = (
  orderInput: CreateOrderInput,
  table: string,
  seat: string,
) => ({
  ...orderInput,
  place: {
    table,
    seat,
  },
});

interface BulkOrderInput {
  order: CreateOrderInput;
  transaction: CreateTransactionInput;
  tipTransaction: CreateTransactionInput;
}

export const seedLotsOfOrders = (
  deps: SeederDependencies,
  idxBase: number,
  range: number,
  orderInput: CreateOrderInput,
  transactionInput: CreateTransactionInput,
  tipTransactionInput: CreateTransactionInput,
) => {
  console.debug(`Creating a lot of test orders (${range}).`);

  return pipe(
    R.range(1, range + 1),
    R.map((index): BulkOrderInput => {
      const orderId = `${seededIdPrefix}order_id_${idxBase + index}`;
      const userId = `${seededIdPrefix}user_id_${idxBase + index}`;
      const transactionId = `${seededIdPrefix}transaction_id_${
        idxBase + index
      }`;
      const tipTransactionId = `${seededIdPrefix}tipTransaction_id_${
        idxBase + index
      }`;

      return {
        order: {
          ...orderInput,
          id: orderId,
          userId,
        },
        transaction: {
          ...transactionInput,
          id: transactionId,
          orderId,
        },
        tipTransaction: {
          ...tipTransactionInput,
          id: tipTransactionId,
          orderId,
        },
      };
    }),
    x => from(x),
  ).pipe(
    concatMap((input: BulkOrderInput) => {
      console.error('input', input);
      return of('magic').pipe(
        switchMap(() =>
          deps.crudSdk.CreateTransaction({ input: input.transaction }),
        ),
        switchMap(() =>
          deps.crudSdk.CreateTransaction({ input: input.tipTransaction }),
        ),
        switchMap(() => deps.crudSdk.CreateOrder({ input: input.order })),
      );
    }),
    toArray(),
    tap(objects => console.debug(`Created ${objects?.length} test orders.`)),
  );
};
