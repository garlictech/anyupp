import { catchError, map, switchMap } from 'rxjs/operators';
import * as CrudApi from '@bgap/crud-gql/api';
import { EProductType } from '@bgap/shared/types';
import {
  chainSeed,
  generatedProductSeed,
  groupSeed,
  productComponentSetSeed,
  seededIdPrefix,
  unitSeed,
} from '@bgap/shared/fixtures';
import { combineLatest, concat, Observable, of } from 'rxjs';
import { pipe } from 'fp-ts/lib/function';
import { filterNullish } from '@bgap/shared/utils';

export interface SeederDependencies {
  crudSdk: CrudApi.CrudSdk;
  userPoolId: string;
}

export type DeletableInput<T> = Omit<T, 'id'> & { id: string };

const generateChainId = (idx: number) => `${seededIdPrefix}chain_${idx}_id`;
const generateGroupId = (chainIdx: number, idx: number) =>
  `${seededIdPrefix}group_c${chainIdx}_${idx}_id`;
const generateUnitId = (chainIdx: number, groupIdx: number, idx: number) =>
  `${seededIdPrefix}unit_c${chainIdx}_g${groupIdx}_${idx}_id`;
const generateLaneId = (
  chainIdx: number,
  groupIdx: number,
  unitIdx: number,
  idx: number,
) => `${seededIdPrefix}lane_c${chainIdx}_g${groupIdx}_u${unitIdx}_${idx}_id`;
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
const generateVariantId = (chainIdx: number, productId: number, idx: number) =>
  `${seededIdPrefix}chain_product_variant_c${chainIdx}_p${productId}_${idx}_id`;
const generateCartId = (idx: number) => `${seededIdPrefix}cart_${idx}_id`;
const generateUserId = (idx: number) => `${seededIdPrefix}user_${idx}_id`;
const generateRoleContextId = (idx: number, role: CrudApi.Role) =>
  `${seededIdPrefix}role_context_${idx}_${role}_id`;
const generateAdminRoleContextId = (idx: number, role: CrudApi.Role) =>
  `${seededIdPrefix}admin_role_context_${idx}_${role}_id`;

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

export const createTestChain = (chainIdx: number) => (
  deps: SeederDependencies,
) => {
  console.debug('createTestChain', {
    chainIdx,
  });
  const input: CrudApi.CreateChainInput = {
    ...chainSeed.chainBase,
    id: generateChainId(chainIdx),
    name: `Seeded chain #${chainIdx}`,
  };
  return deleteCreate(
    () => deps.crudSdk.DeleteChain({ input: { id: input.id ?? '' } }),
    () => deps.crudSdk.CreateChain({ input }),
  );
};

export const createTestGroup = (chainIdx: number, groupIdx: number) => (
  deps: SeederDependencies,
) => {
  console.debug('createTestGroup', {
    chainIdx,
    groupIdx,
  });
  const input: CrudApi.CreateGroupInput = {
    ...groupSeed.groupBase,
    id: generateGroupId(chainIdx, groupIdx),
    chainId: generateChainId(chainIdx),
    name: `Seeded group #${groupIdx}`,
    currency: groupIdx % 2 === 0 ? 'HUF' : 'EUR',
  };
  return deleteCreate(
    () => deps.crudSdk.DeleteGroup({ input: { id: input.id ?? '' } }),
    () => deps.crudSdk.CreateGroup({ input }),
  );
};

export const createAdminUser = (adminUserId: string, email: string) => (
  deps: SeederDependencies,
) => {
  console.debug('createAdminUser', {
    adminUserId,
    email,
  });
  const input: DeletableInput<CrudApi.CreateAdminUserInput> = {
    id: adminUserId,
    name: 'John Doe',
    email,
    phone: '123123213',
    profileImage:
      'https://ocdn.eu/pulscms-transforms/1/-rxktkpTURBXy9jMzIxNGM4NWI2NmEzYTAzMjkwMTQ1NGMwZmQ1MDE3ZS5wbmeSlQMAAM0DFM0Bu5UCzQSwAMLD',
  };
  return deleteCreate(
    () => deps.crudSdk.DeleteAdminUser({ input: { id: input.id ?? '' } }),
    () => deps.crudSdk.CreateAdminUser({ input }),
  );
};

export const createTestUnit = (
  chainIdx: number,
  groupIdx: number,
  unitIdx: number,
) => (deps: SeederDependencies) => {
  console.debug('createTestUnit', {
    chainIdx,
    groupIdx,
    unitIdx,
  });
  const input: CrudApi.CreateUnitInput = {
    ...unitSeed.unitBase,
    id: generateUnitId(chainIdx, groupIdx, unitIdx),
    groupId: generateGroupId(chainIdx, groupIdx),
    chainId: generateChainId(chainIdx),
    name: `Seeded unit #${chainIdx}${groupIdx}${unitIdx}`,
    lanes: [
      {
        color: '#e72222',
        id: generateLaneId(chainIdx, groupIdx, unitIdx, 1),
        name: 'bár',
      },
      {
        color: '#e123ef',
        id: generateLaneId(chainIdx, groupIdx, unitIdx, 2),
        name: 'konyha',
      },
    ],
  };
  return deleteCreate(
    () => deps.crudSdk.DeleteUnit({ input: { id: input.id ?? '' } }),
    () => deps.crudSdk.CreateUnit({ input }),
  );
};

export const createTestProductCategory = (
  chainIdx: number,
  productCategoryId: number,
) => (deps: SeederDependencies) => {
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
    () => deps.crudSdk.DeleteProductCategory({ input: { id: input.id ?? '' } }),
    () => deps.crudSdk.CreateProductCategory({ input }),
  );
};

export const createTestChainProduct = (
  chainIdx: number,
  productCategoryIdx: number,
  productIdx: number,
) => (deps: SeederDependencies) => {
  console.debug('createTestChainProduct', {
    chainIdx,
    productCategoryIdx,
    productIdx,
  });
  const input: DeletableInput<CrudApi.CreateChainProductInput> = {
    id: generateChainProductId(chainIdx, productIdx),
    chainId: generateChainId(chainIdx),
    name: {
      hu: `Teszt chain termék #${productIdx} név`,
      en: `Test chain product #${productIdx} name`,
    },
    description: {
      hu: `Teszt chain termék #${productIdx} leírás`,
      en: `Test chain termék #${productIdx} description`,
    },
    productCategoryId: generateProductCategoryId(chainIdx, productCategoryIdx),
    productType: productIdx % 2 === 0 ? EProductType.FOOD : EProductType.DRINK,
    isVisible: true,
    variants: [
      {
        id: generateVariantId(chainIdx, productIdx, 1),
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
    image: 'https://picsum.photos/100',
    allergens: [
      CrudApi.Allergen.egg,
      CrudApi.Allergen.gluten,
      CrudApi.Allergen.peanut,
    ],
    // Use existing ProductComponentSet
    configSets: productComponentSetSeed.seededChainProductConfigSets,
  };
  return deleteCreate(
    () => deps.crudSdk.DeleteChainProduct({ input: { id: input.id ?? '' } }),
    () => deps.crudSdk.CreateChainProduct({ input }),
  );
};

export const createTestGroupProduct = (
  chainIdx: number,
  groupIdx: number,
  chainProductIdx: number,
  productIdx: number,
) => (deps: SeederDependencies) => {
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
        id: generateVariantId(chainIdx, productIdx, 1),
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
    configSets: productComponentSetSeed.seededGroupProductConfigSets,
  };
  return deleteCreate(
    () => deps.crudSdk.DeleteGroupProduct({ input: { id: input.id ?? '' } }),
    () => deps.crudSdk.CreateGroupProduct({ input }),
  );
};

/**
 * Create UnitProduct and GeneratedProducts too
 */
export const createTestUnitProduct = (
  chainIdx: number,
  groupIdx: number,
  unitIdx: number,
  groupProductIdx: number,
  productIdx: number,
) => (deps: SeederDependencies) => {
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
    laneId: generateLaneId(chainIdx, groupIdx, unitIdx, 1),
    isVisible: true,
    takeaway: false,
    position: productIdx,
    variants: [
      {
        id: generateVariantId(chainIdx, productIdx, 1),
        isAvailable: true,
        price: 11,
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
            price: productIdx * 60,
            timeFrom: '',
            timeTo: '',
            type: 'A',
          },
        ],
      },
    ],
    configSets: productComponentSetSeed.seededUnitProductConfigSets,
  };
  return deleteCreate(
    () => deps.crudSdk.DeleteUnitProduct({ input: { id: input.id ?? '' } }),
    () => deps.crudSdk.CreateUnitProduct({ input }),
  ).pipe(
    filterNullish(),
    switchMap(unitProduct => {
      const input: CrudApi.CreateGeneratedProductInput = {
        ...generatedProductSeed.getGeneratedProduct({
          id: unitProduct.id,
          unitId: unitProduct.unitId,
          productCategoryId: generateProductCategoryId(1, 1),
        }),
        position: unitProduct.position,
        configSets: productComponentSetSeed.generatedProductConfigSets,
      };
      return deleteCreate(
        () =>
          deps.crudSdk.DeleteGeneratedProduct({
            input: { id: input.id ?? '' },
          }),
        () => deps.crudSdk.CreateGeneratedProduct({ input }),
      ).pipe(map(generatedProduct => ({ unitProduct, generatedProduct })));
    }),
  );
};

export const createTestCart = ({
  chainIdx,
  groupIdx,
  unitIdx,
  productIdx,
  userIdx,
  cartIdx,
}: {
  chainIdx: number;
  groupIdx: number;
  unitIdx: number;
  productIdx: number;
  userIdx: number;
  cartIdx: number;
}) => (deps: SeederDependencies) => {
  console.debug('createTestCart', {
    chainIdx,
    groupIdx,
    unitIdx,
    productIdx,
    userIdx,
    cartIdx,
  });
  const input: DeletableInput<CrudApi.CreateCartInput> = {
    id: generateCartId(cartIdx),
    userId: generateUserId(userIdx),
    unitId: generateUnitId(chainIdx, groupIdx, unitIdx),
    paymentMode: {
      name: 'INAPP',
      method: CrudApi.PaymentMethod.inapp,
    },
    takeAway: false,
    items: [
      {
        productName: {
          en: 'Water',
          hu: 'Viz',
        },
        priceShown: {
          currency: 'EUR',
          pricePerUnit: 1,
          priceSum: 2,
          tax: 1,
          taxSum: 2,
        },
        productId: generateUnitProductId(chainIdx, groupIdx, productIdx),
        quantity: 2,
        variantId: generateVariantId(chainIdx, productIdx, 1),
        variantName: {
          en: 'glass',
          hu: 'pohár',
        },
        laneId: generateLaneId(chainIdx, groupIdx, unitIdx, 1),
        image: 'https://picsum.photos/100',
        statusLog: [],
      },
    ],
  };
  return deleteCreate(
    () => deps.crudSdk.DeleteCart({ input: { id: input.id ?? '' } }),
    () => deps.crudSdk.CreateCart({ input }),
  );
};

export const createTestRoleContext = (
  roleContextIdx: number,
  chainIdx: number,
  groupIdx: number,
  unitIdx: number,
) => (deps: SeederDependencies) => {
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

export const createTestAdminRoleContext = (
  adminRoleContextIdx: number,
  roleContextIdx: number,
  adminUserId: string,
) => (deps: SeederDependencies) => {
  console.debug('createTestAdminRoleContext', {
    adminRoleContextIdx,
    roleContextIdx,
    adminUserId,
  });
  const superuserInput: CrudApi.CreateAdminRoleContextInput = {
    id: generateAdminRoleContextId(adminRoleContextIdx, CrudApi.Role.superuser),
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
  console.debug('createComponentSets');
  return deleteCreate(
    () =>
      deps.crudSdk.DeleteProductComponent({
        input: { id: productComponentSetSeed.seededProdComp_01.id ?? '' },
      }),
    () =>
      deps.crudSdk.CreateProductComponent({
        input: productComponentSetSeed.seededProdComp_01,
      }),
  ).pipe(
    switchMap(() =>
      deleteCreate(
        () =>
          deps.crudSdk.DeleteProductComponent({
            input: { id: productComponentSetSeed.seededProdComp_02.id ?? '' },
          }),
        () =>
          deps.crudSdk.CreateProductComponent({
            input: productComponentSetSeed.seededProdComp_02,
          }),
      ),
    ),
    switchMap(() =>
      deleteCreate(
        () =>
          deps.crudSdk.DeleteProductComponent({
            input: { id: productComponentSetSeed.seededProdComp_03.id ?? '' },
          }),
        () =>
          deps.crudSdk.CreateProductComponent({
            input: productComponentSetSeed.seededProdComp_03,
          }),
      ),
    ),
    switchMap(() =>
      deleteCreate(
        () =>
          deps.crudSdk.DeleteProductComponentSet({
            input: {
              id: productComponentSetSeed.seededProdCompSet_01.id ?? '',
            },
          }),
        () =>
          deps.crudSdk.CreateProductComponent({
            input: productComponentSetSeed.seededProdCompSet_01,
          }),
      ),
    ),
    switchMap(() =>
      deleteCreate(
        () =>
          deps.crudSdk.DeleteProductComponentSet({
            input: {
              id: productComponentSetSeed.seededProdCompSet_02.id ?? '',
            },
          }),
        () =>
          deps.crudSdk.CreateProductComponent({
            input: productComponentSetSeed.seededProdCompSet_02,
          }),
      ),
    ),
  );
};

export const createSeederDeps = (
  awsAccesssKeyId: string,
  awsSecretAccessKey: string,
  userPoolId: string,
): SeederDependencies => ({
  userPoolId,
  crudSdk: CrudApi.getCrudSdkForIAM(awsAccesssKeyId, awsSecretAccessKey),
});
