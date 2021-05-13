import { catchError, delay, switchMap, tap } from 'rxjs/operators';
import * as CrudApi from '@bgap/crud-gql/api';

import { EProductType, EAdminRole } from '@bgap/shared/types';
import { seededIdPrefix } from '@bgap/shared/fixtures';
import { combineLatest, concat, from, Observable, of } from 'rxjs';
import { Reader } from 'fp-ts/lib/Reader';

export interface SeederDependencies {
  crudSdk: CrudApi.AmplifySdk;
  userPoolId: string;
}

type SeederReader<T> = Reader<SeederDependencies, Observable<T>>;

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
const generateRoleContextId = (idx: number, role: EAdminRole) =>
  `${seededIdPrefix}role_context_${idx}_${role}_id`;
const generateAdminRoleContextId = (idx: number, role: EAdminRole) =>
  `${seededIdPrefix}admin_role_context_${idx}_${role}_id`;

type DeleteCreateInput<T> = {
  input: T;
  deleteOperation: keyof CrudApi.AmplifySdk;
  createOperation: keyof CrudApi.AmplifySdk;
};

const deleteCreate = <INPUT extends { id: string }, OUTPUT>({
  input,
  deleteOperation,
  createOperation,
}: DeleteCreateInput<INPUT>): SeederReader<OUTPUT> => deps =>
  from(deps.crudSdk[deleteOperation]).pipe(
    catchError(error => {
      console.warn(
        'Problem with SEED data DELETION: create: ',
        createOperation,
        ' delete: ',
        deleteOperation,
        ' input: ',
        input,
        'error: ',
        error,
      );
      return of('STILL TRY TO CREATE IT PLEASE');
    }),
    delay(1000),
    switchMap(() => from(deps.crudSdk[createOperation])),
  );

export const createTestChain = (chainIdx: number) => {
  const input: DeletableInput<CrudApi.CreateChainInput> = {
    id: generateChainId(chainIdx),
    name: `Test chain #${chainIdx}`,
    description: {
      hu: `Teszt lánc #${chainIdx} leírás`,
      en: `Test chain #${chainIdx} description`,
    },
    isActive: true,
    email: `info@chain${chainIdx}.com`,
    phone: '1234567890',
    style: {
      colors: {
        backgroundLight: '#FFFFFF',
        backgroundDark: '#D6DDE0',
        textDark: '#303030',
        textLight: '#FFFFFF',
        indicator: '#30BF60',
        highlight: '#A8692A',
        disabled: '#303030',
        borderDark: '#E7E5D0',
        borderLight: '#C3CACD',
      },
    },
  };
  return deleteCreate({
    input,
    deleteOperation: 'DeleteChain',
    createOperation: 'CreateChain',
  });
};

export const createTestGroup = (chainIdx: number, groupIdx: number) => {
  const input: DeletableInput<CrudApi.CreateGroupInput> = {
    id: generateGroupId(chainIdx, groupIdx),
    chainId: generateChainId(chainIdx),
    name: `Test group #${groupIdx}`,
    description: {
      hu: `Teszt group #${groupIdx} leírás`,
      en: `Test group #${groupIdx} description`,
    },
    currency: groupIdx % 2 === 0 ? 'HUF' : 'EUR',
  };
  return deleteCreate({
    input,
    deleteOperation: 'DeleteGroup',
    createOperation: 'CreateGroup',
  });
};

export const createTestUnit = (
  chainIdx: number,
  groupIdx: number,
  unitIdx: number,
) => {
  const input: DeletableInput<CrudApi.CreateUnitInput> = {
    id: generateUnitId(chainIdx, groupIdx, unitIdx),
    groupId: generateGroupId(chainIdx, groupIdx),
    chainId: generateChainId(chainIdx),
    isActive: true,
    isAcceptingOrders: true,
    name: `Seeded unit #${chainIdx}${groupIdx}${unitIdx}`,
    address: {
      address: 'Ág u. 1.',
      city: 'Budapest',
      country: 'Magyarország',
      title: 'HQ',
      postalCode: '1021',
      location: {
        lat: 47,
        lng: 19,
      },
    },
    description: {
      hu: `Teszt unit #${unitIdx} leírás`,
      en: `Test unit #${unitIdx} description`,
    },
    paymentModes: [
      {
        method: CrudApi.PaymentMethod.cash,
        name: 'Cash',
      },
      {
        method: CrudApi.PaymentMethod.card,
        name: 'Card',
      },
      {
        method: CrudApi.PaymentMethod.inapp,
        name: 'Stripe',
      },
    ],
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
    open: {
      from: '08:00',
      to: '18:00',
    },
  };
  return deleteCreate({
    input,
    deleteOperation: 'DeleteUnit',
    createOperation: 'CreateUnit',
  });
};

export const createTestProductCategory = (
  chainIdx: number,
  productCategoryId: number,
) => {
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

  return deleteCreate({
    input,
    deleteOperation: 'DeleteProductCategory',
    createOperation: 'CreateProductCategory',
  });
};

export const createTestChainProduct = (
  chainIdx: number,
  productCategoryIdx: number,
  productIdx: number,
) => {
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
  };
  return deleteCreate({
    input,
    deleteOperation: 'DeleteChainProduct',
    createOperation: 'CreateChainProduct',
  });
};

export const createTestGroupProduct = (
  chainIdx: number,
  groupIdx: number,
  chainProductIdx: number,
  productIdx: number,
) => {
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
  };
  return deleteCreate({
    input,
    deleteOperation: 'DeleteGroupProduct',
    createOperation: 'CreateGroupProduct',
  });
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
) => {
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
  };
  return deleteCreate({
    input,
    deleteOperation: 'DeleteUnitProduct',
    createOperation: 'CreateUnitProduct',
  });
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
}) => {
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
  return deleteCreate({
    input,
    deleteOperation: 'DeleteCart',
    createOperation: 'CreateCart',
  });
};

export const createTestRoleContext = (
  roleContextIdx: number,
  chainIdx: number,
  groupIdx: number,
  unitIdx: number,
) => {
  console.debug('createTestRoleContext', {
    roleContextIdx,
    chainIdx,
    groupIdx,
    unitIdx,
  });

  const superuserInput: DeletableInput<CrudApi.CreateRoleContextInput> = {
    id: generateRoleContextId(roleContextIdx, EAdminRole.SUPERUSER),
    name: {
      hu: `Test SUPERUSER role context #${roleContextIdx}`,
      en: `Test SUPERUSER role context #${roleContextIdx}`,
    },
    role: EAdminRole.SUPERUSER,
    contextId: 'SU_CTX_ID',
  };
  const chainAdminInput: DeletableInput<CrudApi.CreateRoleContextInput> = {
    id: generateRoleContextId(roleContextIdx, EAdminRole.CHAIN_ADMIN),
    name: {
      hu: `Test CHAIN_ADMIN role context #${roleContextIdx}`,
      en: `Test CHAIN_ADMIN role context #${roleContextIdx}`,
    },
    role: EAdminRole.CHAIN_ADMIN,
    contextId: 'CA_CTX_ID',
    chainId: generateChainId(chainIdx),
  };
  const r3 = EAdminRole.GROUP_ADMIN;
  const groupAdminInput: DeletableInput<CrudApi.CreateRoleContextInput> = {
    id: generateRoleContextId(roleContextIdx, r3),
    name: {
      hu: `Test GROUP_ADMIN role context #${roleContextIdx}`,
      en: `Test GROUP_ADMIN role context #${roleContextIdx}`,
    },
    role: r3,
    contextId: 'GA_CTX_ID',
    chainId: generateChainId(chainIdx),
    groupId: generateGroupId(chainIdx, groupIdx),
  };
  const r4 = EAdminRole.UNIT_ADMIN;
  const unitAdminInput: DeletableInput<CrudApi.CreateRoleContextInput> = {
    id: generateRoleContextId(roleContextIdx, r4),
    name: {
      hu: `Test UNIT_ADMIN role context #${roleContextIdx}`,
      en: `Test UNIT_ADMIN role context #${roleContextIdx}`,
    },
    role: r4,
    contextId: 'UA_CTX_ID',
    chainId: generateChainId(chainIdx),
    groupId: generateGroupId(chainIdx, groupIdx),
    unitId: generateUnitId(chainIdx, groupIdx, unitIdx),
  };
  const r5 = EAdminRole.STAFF;
  const staffInput: DeletableInput<CrudApi.CreateRoleContextInput> = {
    id: generateRoleContextId(roleContextIdx, r5),
    name: {
      hu: `Test STAFF role context #${roleContextIdx}`,
      en: `Test STAFF role context #${roleContextIdx}`,
    },
    role: r5,
    contextId: 'STF_CTX_ID',
    chainId: generateChainId(chainIdx),
    groupId: generateGroupId(chainIdx, groupIdx),
    unitId: generateUnitId(chainIdx, groupIdx, unitIdx),
  };

  return concat(
    deleteCreate({
      input: superuserInput,
      deleteOperation: 'DeleteRoleContext',
      createOperation: 'CreateRoleContext',
    }),
    deleteCreate({
      input: chainAdminInput,
      deleteOperation: 'DeleteRoleContext',
      createOperation: 'CreateRoleContext',
    }),
    deleteCreate({
      input: groupAdminInput,
      deleteOperation: 'DeleteRoleContext',
      createOperation: 'CreateRoleContext',
    }),
    deleteCreate({
      input: unitAdminInput,
      deleteOperation: 'DeleteRoleContext',
      createOperation: 'CreateRoleContext',
    }),
    deleteCreate({
      input: staffInput,
      deleteOperation: 'DeleteRoleContext',
      createOperation: 'CreateRoleContext',
    }),
  ).pipe(tap(() => console.debug('createTestRoleContext SUCCESS')));
};

export const deleteTestAdminRoleContext = (adminRoleContextIdx: number) => (
  deps: SeederDependencies,
) => {
  const idSuper = generateAdminRoleContextId(
    adminRoleContextIdx,
    EAdminRole.SUPERUSER,
  );
  const idChainAdmin = generateAdminRoleContextId(
    adminRoleContextIdx,
    EAdminRole.CHAIN_ADMIN,
  );

  return concat(
    from(
      deps.crudSdk.DeleteAdminRoleContext({
        input: {
          id: idSuper,
        },
      }),
    ),
    from(
      deps.crudSdk.DeleteAdminRoleContext({
        input: {
          id: idChainAdmin,
        },
      }),
    ),
  ).pipe(
    catchError(err => {
      console.warn(
        `Can NOT delete the AdminRoleContext with id: ${idChainAdmin}`,
        err,
      );
      return of('SUCCESS');
    }),
  );
};

export const createTestAdminRoleContext = (
  adminRoleContextIdx: number,
  roleContextIdx: number,
  adminUserId: string,
) => (deps: SeederDependencies) => {
  const superuserInput: CrudApi.CreateAdminRoleContextInput = {
    id: generateAdminRoleContextId(adminRoleContextIdx, EAdminRole.SUPERUSER),
    adminUserId,
    roleContextId: generateRoleContextId(roleContextIdx, EAdminRole.SUPERUSER),
  };
  const chainAdminInput: CrudApi.CreateAdminRoleContextInput = {
    id: generateAdminRoleContextId(adminRoleContextIdx, EAdminRole.CHAIN_ADMIN),
    adminUserId,
    roleContextId: generateRoleContextId(
      roleContextIdx,
      EAdminRole.CHAIN_ADMIN,
    ),
  };

  return combineLatest([
    from(deps.crudSdk.CreateAdminRoleContext({ input: superuserInput })),
    from(deps.crudSdk.CreateAdminRoleContext({ input: chainAdminInput })),
  ]);
};

export const createSeederDeps = (
  awsAccesssKeyId: string,
  awsSecretAccessKey: string,
  userPoolId: string,
): SeederDependencies => ({
  userPoolId,
  crudSdk: CrudApi.getCrudSdkForIAM(awsAccesssKeyId, awsSecretAccessKey),
});
