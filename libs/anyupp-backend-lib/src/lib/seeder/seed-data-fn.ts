import * as CrudApi from '@bgap/crud-gql/api';
import {
  chainFixture,
  groupFixture,
  productComponentSetFixture,
  seededIdPrefix,
  unitFixture,
} from '@bgap/shared/fixtures';
import { EProductType } from '@bgap/shared/types';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { pipe } from 'fp-ts/lib/function';
import { DateTime } from 'luxon';
import { combineLatest, concat, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import * as R from 'ramda';

export interface SeederDependencies {
  crudSdk: CrudApi.CrudSdk;
  userPoolId: string;
  consumerUserPoolId: string;
  cognitoidentityserviceprovider: CognitoIdentityServiceProvider;
}

export type DeletableInput<T> = Omit<T, 'id'> & { id: string };

const generateChainId = (idx: number) => `${seededIdPrefix}chain_${idx}_id`;
const generateGroupId = (chainIdx: number, idx: number) =>
  `${seededIdPrefix}group_c${chainIdx}_${idx}_id`;
const generateUnitId = (chainIdx: number, groupIdx: number, idx: number) =>
  `${seededIdPrefix}unit_c${chainIdx}_g${groupIdx}_${idx}_id`;
const generateProductCategoryId = (chainIdx: number, idx: number) =>
  `${seededIdPrefix}product_category_c${chainIdx}_${idx}_id`;
const generateChainProductId = (chainIdx: number, idx: number) =>
  `${seededIdPrefix}chain_product_c${chainIdx}_${idx}_id`;
const generateGroupProductId = (
  chainIdx: number,
  groupIdx: number,
  idx: number,
) => `${seededIdPrefix}group_product_c${chainIdx}_g${groupIdx}_${idx}_id`;
const generateUnitProductId = (
  chainIdx: number,
  groupIdx: number,
  idx: number,
) => `${seededIdPrefix}unit_product_c${chainIdx}_g${groupIdx}_${idx}_id`;
const generateVariantId = (
  chainIdx: number,
  productId: number,
  idx: number,
  type: string,
) =>
  `${seededIdPrefix}${type}_product_variant_c${chainIdx}_p${productId}_${idx}_id`;
const generateOrderId = (idx: number) => `${seededIdPrefix}order_${idx}_id`;
const generateUserId = (idx: number) => `${seededIdPrefix}user_${idx}_id`;
const generateRoleContextId = (idx: number, role: CrudApi.Role) =>
  `${seededIdPrefix}role_context_${idx}_${role}_id`;
const generateAdminRoleContextId = (
  idx: number,
  role: CrudApi.Role,
  username: string,
) => `${seededIdPrefix}admin_role_context_${idx}_${role}_${username}_id`;

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

  const input: CrudApi.CreateUserInput = {
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
    const input: CrudApi.CreateChainInput = {
      ...chainFixture.chainBase,
      id: generateChainId(chainIdx),
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
    const input: CrudApi.CreateGroupInput = {
      ...groupFixture.groupBase,
      id: generateGroupId(chainIdx, groupIdx),
      chainId: generateChainId(chainIdx),
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
    const input: DeletableInput<CrudApi.CreateAdminUserInput> = {
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
    const input: CrudApi.CreateUnitInput = {
      ...R.omit(['createdAt', 'updatedAt'], unitFixture.unitBase),
      id: generateUnitId(chainIdx, groupIdx, unitIdx),
      groupId: generateGroupId(chainIdx, groupIdx),
      chainId: generateChainId(chainIdx),
      name: `Késdobáló #${chainIdx}${groupIdx}${unitIdx}`,
      timeZone: 'Europe/Budapest',
      supportedServingModes:
        unitIdx % 2 === 1
          ? unitFixture.unitBase.supportedServingModes
          : [CrudApi.ServingMode.inplace],
      supportedOrderModes:
        unitIdx % 2 === 1
          ? unitFixture.unitBase.supportedOrderModes
          : [CrudApi.OrderMode.instant],
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
            t: CrudApi.UnitMapObjectType.table_r,
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
            t: CrudApi.UnitMapObjectType.table_r,
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
            t: CrudApi.UnitMapObjectType.table_r,
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
            t: CrudApi.UnitMapObjectType.seat_r,
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
            t: CrudApi.UnitMapObjectType.seat_r,
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
            t: CrudApi.UnitMapObjectType.seat_r,
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
            t: CrudApi.UnitMapObjectType.seat_r,
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
            t: CrudApi.UnitMapObjectType.seat_r,
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
            t: CrudApi.UnitMapObjectType.seat_r,
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
            t: CrudApi.UnitMapObjectType.seat_r,
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
            t: CrudApi.UnitMapObjectType.seat_r,
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
            t: CrudApi.UnitMapObjectType.seat_r,
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
        ...R.omit(['createdAt', 'updatedAt'], unit),
        groupId: generateGroupId(1, 1),
        chainId: generateChainId(1),
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
    const input: DeletableInput<CrudApi.CreateProductCategoryInput> = {
      id: generateProductCategoryId(chainIdx, productCategoryId),
      chainId: generateChainId(chainIdx),
      name: {
        hu: `Teszt termék kategória #${productCategoryId} név`,
        en: `Test product category #${productCategoryId} name`,
      },
      description: {
        hu: `Teszt product kategória #${productCategoryId} leírás`,
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

export const createTestChainProduct =
  (
    chainIdx: number,
    productCategoryIdx: number,
    productIdx: number,
    productName: string,
    productType: EProductType,
  ) =>
  (deps: SeederDependencies) => {
    console.debug('createTestChainProduct', {
      chainIdx,
      productCategoryIdx,
      productIdx,
      productName,
      productType,
    });
    const input: DeletableInput<CrudApi.CreateChainProductInput> = {
      id: generateChainProductId(chainIdx, productIdx),
      chainId: generateChainId(chainIdx),
      name: {
        hu: `${productName} #${productIdx}`,
        en: `${productName} #${productIdx}`,
      },
      description: {
        hu: `${productName} #${productIdx} leírás`,
        en: `${productName} #${productIdx} description`,
      },
      productCategoryId: generateProductCategoryId(
        chainIdx,
        productCategoryIdx,
      ),
      productType,
      isVisible: true,
      variants: [
        {
          id: generateVariantId(chainIdx, productIdx, 1, 'chain'),
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
      allergens: [
        CrudApi.Allergen.egg,
        CrudApi.Allergen.gluten,
        CrudApi.Allergen.peanut,
      ],
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
    const input: DeletableInput<CrudApi.CreateGroupProductInput> = {
      id: generateGroupProductId(chainIdx, groupIdx, productIdx),
      parentId: generateChainProductId(chainIdx, chainProductIdx),
      chainId: generateChainId(chainIdx),
      groupId: generateGroupId(chainIdx, groupIdx),
      isVisible: true,
      tax: 27,
      variants: [
        {
          id: generateVariantId(chainIdx, productIdx, 1, 'group'),
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
    const input: DeletableInput<CrudApi.CreateUnitProductInput> = {
      id: generateUnitProductId(chainIdx, groupIdx, productIdx),
      parentId: generateGroupProductId(chainIdx, groupIdx, groupProductIdx),
      chainId: generateChainId(chainIdx),
      groupId: generateGroupId(chainIdx, groupIdx),
      unitId: generateUnitId(chainIdx, groupIdx, unitIdx),
      laneId: 'lane_01',
      isVisible: true,
      takeaway: false,
      supportedServingModes: [CrudApi.ServingMode.takeaway],
      position: productIdx,
      variants: [
        {
          id: generateVariantId(chainIdx, productIdx, 1, 'unit'),
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
    const input: DeletableInput<CrudApi.CreateOrderInput> = {
      id: generateOrderId(orderIdx),
      userId: generateUserId(userIdx),
      unitId: generateUnitId(chainIdx, groupIdx, unitIdx),
      paymentMode: {
        type: CrudApi.PaymentType.stripe,
        method: CrudApi.PaymentMethod.inapp,
      },
      takeAway: false,
      orderMode: CrudApi.OrderMode.pickup,
      servingMode: CrudApi.ServingMode.takeaway,
      archived: false,
      orderNum: '007007',
      statusLog: [
        {
          userId: 'ADMIN_USER_ID',
          status: CrudApi.OrderStatus.none,
          ts: DateTime.utc().toMillis(),
        },
      ],
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
          productId: generateUnitProductId(chainIdx, groupIdx, productIdx),
          quantity: 2,
          variantId: generateVariantId(chainIdx, productIdx, 1, 'unit'),
          variantName: {
            en: 'glass',
            hu: 'pohár',
          },
          laneId: 'lane_01',
          image: 'https://picsum.photos/100',
          statusLog: [],
          productType: EProductType.DRINK,
        },
      ],
    };
    return deleteCreate(
      () => deps.crudSdk.DeleteOrder({ input: { id: input.id ?? '' } }),
      () => deps.crudSdk.CreateOrder({ input }),
    );
  };

export const createTestRoleContext =
  (
    roleContextIdx: number,
    chainIdx: number,
    groupIdx: number,
    unitIdx: number,
  ) =>
  (deps: SeederDependencies) => {
    console.debug('createTestRoleContext', {
      roleContextIdx,
      chainIdx,
      groupIdx,
      unitIdx,
    });

    const superuserInput: DeletableInput<CrudApi.CreateRoleContextInput> = {
      id: generateRoleContextId(roleContextIdx, CrudApi.Role.superuser),
      name: {
        hu: `Test superuser role context #${roleContextIdx}`,
        en: `Test superuser role context #${roleContextIdx}`,
      },
      role: CrudApi.Role.superuser,
      contextId: 'SU_CTX_ID',
    };
    const chainadminInput: DeletableInput<CrudApi.CreateRoleContextInput> = {
      id: generateRoleContextId(roleContextIdx, CrudApi.Role.chainadmin),
      name: {
        hu: `Test chainadmin role context #${roleContextIdx}`,
        en: `Test chainadmin role context #${roleContextIdx}`,
      },
      role: CrudApi.Role.chainadmin,
      contextId: 'CA_CTX_ID',
      chainId: generateChainId(chainIdx),
    };
    const r3 = CrudApi.Role.groupadmin;
    const groupadminInput: DeletableInput<CrudApi.CreateRoleContextInput> = {
      id: generateRoleContextId(roleContextIdx, r3),
      name: {
        hu: `Test groupadmin role context #${roleContextIdx}`,
        en: `Test groupadmin role context #${roleContextIdx}`,
      },
      role: r3,
      contextId: 'GA_CTX_ID',
      chainId: generateChainId(chainIdx),
      groupId: generateGroupId(chainIdx, groupIdx),
    };
    const r4 = CrudApi.Role.unitadmin;
    const unitAdminInput: DeletableInput<CrudApi.CreateRoleContextInput> = {
      id: generateRoleContextId(roleContextIdx, r4),
      name: {
        hu: `Test unitadmin role context #${roleContextIdx}`,
        en: `Test unitadmin role context #${roleContextIdx}`,
      },
      role: r4,
      contextId: 'UA_CTX_ID',
      chainId: generateChainId(chainIdx),
      groupId: generateGroupId(chainIdx, groupIdx),
      unitId: generateUnitId(chainIdx, groupIdx, unitIdx),
    };
    const r5 = CrudApi.Role.staff;
    const staffInput: DeletableInput<CrudApi.CreateRoleContextInput> = {
      id: generateRoleContextId(roleContextIdx, r5),
      name: {
        hu: `Test staff role context #${roleContextIdx}`,
        en: `Test staff role context #${roleContextIdx}`,
      },
      role: r5,
      contextId: 'STF_CTX_ID',
      chainId: generateChainId(chainIdx),
      groupId: generateGroupId(chainIdx, groupIdx),
      unitId: generateUnitId(chainIdx, groupIdx, unitIdx),
    };

    const handleRoleContext = <INPUT extends CrudApi.CreateRoleContextInput>(
      input: INPUT,
    ) =>
      deleteCreate(
        () => deps.crudSdk.DeleteRoleContext({ input: { id: input.id ?? '' } }),
        () => deps.crudSdk.CreateRoleContext({ input }),
      );

    return concat(
      ...[
        superuserInput,
        chainadminInput,
        groupadminInput,
        unitAdminInput,
        staffInput,
      ].map(x => handleRoleContext(x)),
    );
  };

export const createTestAdminRoleContext =
  (adminRoleContextIdx: number, roleContextIdx: number, adminUserId: string) =>
  (deps: SeederDependencies) => {
    console.debug('createTestAdminRoleContext', {
      adminRoleContextIdx,
      roleContextIdx,
      adminUserId,
    });
    const superuserInput: CrudApi.CreateAdminRoleContextInput = {
      id: generateAdminRoleContextId(
        adminRoleContextIdx,
        CrudApi.Role.superuser,
        adminUserId,
      ),
      adminUserId,
      roleContextId: generateRoleContextId(
        roleContextIdx,
        CrudApi.Role.superuser,
      ),
    };
    const chainadminInput: CrudApi.CreateAdminRoleContextInput = {
      id: generateAdminRoleContextId(
        adminRoleContextIdx,
        CrudApi.Role.chainadmin,
        adminUserId,
      ),
      adminUserId,
      roleContextId: generateRoleContextId(
        roleContextIdx,
        CrudApi.Role.chainadmin,
      ),
    };

    return pipe(
      [superuserInput, chainadminInput].map(input =>
        deleteCreate(
          () =>
            deps.crudSdk.DeleteAdminRoleContext({
              input: { id: input.id ?? '' },
            }),
          () => deps.crudSdk.CreateAdminRoleContext({ input }),
        ),
      ),
      combineLatest,
    );
  };

export const createComponentSets = (deps: SeederDependencies) => {
  console.debug('createComponentSets - 3 components and 2 component sets');
  return deleteCreate(
    () =>
      deps.crudSdk.DeleteProductComponent({
        input: { id: productComponentSetFixture.seededProdComp_01.id },
      }),
    () =>
      deps.crudSdk.CreateProductComponent({
        input: productComponentSetFixture.seededProdComp_01,
      }),
  ).pipe(
    switchMap(() =>
      deleteCreate(
        () =>
          deps.crudSdk.DeleteProductComponent({
            input: { id: productComponentSetFixture.seededProdComp_02.id },
          }),
        () =>
          deps.crudSdk.CreateProductComponent({
            input: productComponentSetFixture.seededProdComp_02,
          }),
      ),
    ),
    switchMap(() =>
      deleteCreate(
        () =>
          deps.crudSdk.DeleteProductComponent({
            input: { id: productComponentSetFixture.seededProdComp_03.id },
          }),
        () =>
          deps.crudSdk.CreateProductComponent({
            input: productComponentSetFixture.seededProdComp_03,
          }),
      ),
    ),
    switchMap(() =>
      deleteCreate(
        () =>
          deps.crudSdk.DeleteProductComponentSet({
            input: { id: productComponentSetFixture.seededProdCompSet_01.id },
          }),
        () =>
          deps.crudSdk.CreateProductComponentSet({
            input: productComponentSetFixture.seededProdCompSet_01,
          }),
      ),
    ),
    switchMap(() =>
      deleteCreate(
        () =>
          deps.crudSdk.DeleteProductComponentSet({
            input: { id: productComponentSetFixture.seededProdCompSet_02.id },
          }),
        () =>
          deps.crudSdk.CreateProductComponentSet({
            input: productComponentSetFixture.seededProdCompSet_02,
          }),
      ),
    ),
  );
};

export const seedRKeeperUnit = (deps: SeederDependencies) =>
  combineLatest(
    deleteCreate(
      () => deps.crudSdk.DeleteUnit({ input: { id: 'seeded-rkeeper-unit' } }),
      () =>
        deps.crudSdk.CreateUnit({
          input: {
            ...unitFixture.createRkeeperUnit,
            id: 'seeded-rkeeper-unit',
            name: `Test RKEEPER unit`,
            supportedOrderModes: [CrudApi.OrderMode.pickup],
            supportedServingModes: [CrudApi.ServingMode.takeaway],
            externalId: 'external-id',
            groupId: 'seeded-rkeeper-group',
            chainId: 'seeded-rkeeper-chain',
          },
        }),
    ),

    deleteCreate(
      () => deps.crudSdk.DeleteGroup({ input: { id: 'seeded-rkeeper-group' } }),
      () =>
        deps.crudSdk.CreateGroup({
          input: {
            ...groupFixture.group_01,
            id: 'seeded-rkeeper-group',
            name: 'Test RKEEPER Group',
            chainId: 'seeded-rkeeper-chain',
          },
        }),
    ),

    deleteCreate(
      () => deps.crudSdk.DeleteChain({ input: { id: 'seeded-rkeeper-chain' } }),
      () =>
        deps.crudSdk.CreateChain({
          input: {
            ...chainFixture.chain_01,
            id: 'seeded-rkeeper-chain',
            name: 'Test RKEEPER Chain',
          },
        }),
    ),
  );
