import {
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
} from '@bgap/domain';
import { DateTime } from 'luxon';
import * as R from 'ramda';
import { forkJoin, from, Observable, of } from 'rxjs';
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

export const createTestUnit = (deps: SeederDependencies) => {
  console.debug('createTestUnit');
  const input: CreateUnitInput = {
    ...R.omit(['createdAt', 'updatedAt'], unitFixture.unitBase),
    id: 'a-kesdobalo',
    name: `Késdobáló`,
    timeZone: 'Europe/Budapest',
    supportedServingModes: [ServingMode.inplace],
    supportedOrderModes: [OrderMode.instant],
    coverBanners: [
      {
        imageUrl:
          'http://1.bp.blogspot.com/--hTHo2uuDHM/UicXpXI-cNI/AAAAAAAAAzQ/zOrpgDVawJo/s1600/rejt%C5%91.jpg',
      },
    ],
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
      R.map(input =>
        deleteCreate(
          () => deps.crudSdk.DeleteUnit({ input: { id: input.id ?? '' } }),
          () => deps.crudSdk.CreateUnit({ input }),
        ),
      ),
      x => forkJoin(x),
    );
  };

export const createTestProductCategory =
  (unitIdx: number, productCategoryId: number) =>
  (deps: SeederDependencies) => {
    console.debug('createTestProductCategory', {
      unitIdx,
      productCategoryId,
    });

    const input: DeletableInput<CreateProductCategoryInput> = {
      id: seedUtils.generateProductCategoryId(unitIdx, productCategoryId),
      ownerEntity: seedUtils.generateUnitId(unitIdx),
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

export const createUnitProductsFromSnapshot = (deps: SeederDependencies) => {
  const deleteCreateUnitProduct = (input: CreateUnitProductInput) =>
    deleteCreate(
      () => deps.crudSdk.DeleteUnitProduct({ input: { id: input.id ?? '' } }),
      () => deps.crudSdk.CreateUnitProduct({ input }),
    );

  return forkJoin([
    deleteCreateUnitProduct(productSnapshotFixture.unitProduct_1),
    deleteCreateUnitProduct(productSnapshotFixture.unitProduct_2),
    deleteCreateUnitProduct(productSnapshotFixture.unitProduct_3),
  ]);
};

/**
 * Create UnitProduct and GeneratedProducts too
 */
export const createTestUnitProduct =
  (unitIdx: number, groupProductIdx: number, productIdx: number) =>
  (deps: SeederDependencies) => {
    console.debug('createTestUnitProduct', {
      unitIdx,
      groupProductIdx,
      productIdx,
    });
    const input: DeletableInput<CreateUnitProductInput> = {
      id: seedUtils.generateUnitProductId(unitIdx, productIdx),
      unitId: seedUtils.generateUnitId(unitIdx),
      laneId: 'lane_01',
      isVisible: true,
      takeaway: false,
      supportedServingModes: [ServingMode.takeaway],
      position: productIdx,
      takeawayTax: 20,
      tax: 27,
      image: 'https://picsum.photos/200?random=1',
      name: {
        de: 'Hamburger',
        en: 'Hamburger',
        hu: 'Hamburger',
      },
      productCategoryId: 'seeded_product_category_c1_1_id',
      productType: ProductType.food,
      allergens: [
        Allergen.egg,
        Allergen.gluten,
        Allergen.mustard,
        Allergen.milk,
        Allergen.soya,
        Allergen.fish,
        Allergen.sesame,
      ],
      description: {
        de: 'laktató szendvics',
        en: 'laktató szendvics',
        hu: 'laktató szendvics',
      },
      variants: [
        {
          id: seedUtils.generateVariantId(unitIdx, productIdx, 1, 'unit'),
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
    unitIdx,
    productIdx,
    userIdx,
    orderIdx,
  }: {
    unitIdx: number;
    productIdx: number;
    userIdx: number;
    orderIdx: number;
  }) =>
  (deps: SeederDependencies) => {
    console.debug('createTestOrder', {
      unitIdx,
      productIdx,
      userIdx,
      orderIdx,
    });
    const input: DeletableInput<CreateOrderInput> = {
      id: seedUtils.generateOrderId(orderIdx),
      userId: seedUtils.generateUserId(userIdx),
      unitId: seedUtils.generateUnitId(unitIdx),
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
          productId: seedUtils.generateUnitProductId(unitIdx, productIdx),
          quantity: 2,
          variantId: seedUtils.generateVariantId(
            unitIdx,
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
  forkJoin([
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
  ]);

export const seedYellowRKeeperUnit = (deps: SeederDependencies) =>
  forkJoin([
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
  ]);

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
