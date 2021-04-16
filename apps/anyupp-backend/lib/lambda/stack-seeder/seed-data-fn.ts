import { pipe } from 'fp-ts/lib/function';
import { combineLatest, from, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import API, { graphqlOperation } from '@aws-amplify/api-graphql';
import { CrudApi, CrudApiMutationDocuments } from '@bgap/crud-gql/api';
import { EAdminRole, EProductType } from '@bgap/shared/types';

const generateRoleContextId = (idx: number, role: EAdminRole) => `role_context_${idx}_${role}_id`;
const generateChainId = (idx: number) => `chain_${idx}_id`;
const generateGroupId = (chainIdx: number, idx: number) =>
  `group_c${chainIdx}_${idx}_id`;
const generateUnitId = (chainIdx: number, groupIdx: number, idx: number) =>
  `unit_c${chainIdx}_g${groupIdx}_${idx}_id`;
const generateLaneId = (
  chainIdx: number,
  groupIdx: number,
  unitIdx: number,
  idx: number,
) => `lane_c${chainIdx}_g${groupIdx}_u${unitIdx}_${idx}_id`;
const generateProductCategoryId = (chainIdx: number, idx: number) =>
  `product_category_c${chainIdx}_${idx}_id`;
const generateChainProductId = (chainIdx: number, idx: number) =>
  `chain_product_c${chainIdx}_${idx}_id`;
const generateGroupProductId = (
  chainIdx: number,
  groupIdx: number,
  idx: number,
) => `group_product_c${chainIdx}_g${groupIdx}_${idx}_id`;
const generateUnitProductId = (
  chainIdx: number,
  groupIdx: number,
  idx: number,
) => `unit_product_c${chainIdx}_g${groupIdx}_${idx}_id`;
const generateVariantId = (chainIdx: number, productId: number, idx: number) =>
  `chain_product_variant_c${chainIdx}_p${productId}_${idx}_id`;
const generateCartId = (idx: number) => `cart_${idx}_id`;
const generateUserId = (idx: number) => `user_${idx}_id`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const promiseOrObservableResponseCheck = (operation: any) =>
  operation instanceof Promise
    ? from(operation)
    : throwError('Wrong graphql operation');

const deleteCreate = ({
  input,
  deleteOperation,
  createOperation,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: any;
  deleteOperation: string;
  createOperation: string;
}) =>
  pipe(
    API.graphql(
      graphqlOperation(deleteOperation, {
        input: { id: input.id },
      }),
    ),
    promiseOrObservableResponseCheck,
  ).pipe(
    // catchError((err: Error) => {
    //   console.error(err);
    //   if (!err.message.includes('Record does not exist')) {
    //     console.warn('Probably normal error: ', err);
    //   }
    //   return of({});
    // }),
    switchMap(() =>
      pipe(
        API.graphql(
          graphqlOperation(createOperation, {
            input,
          }),
        ),
        promiseOrObservableResponseCheck,
      ),
    ),
  );

export const createTestChain = (chainIdx: number) => {
  const input: CrudApi.CreateChainInput = {
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
        backgroundLight: '#ffffff',
        backgroundDark: '#ffffff',
        borderLight: '#ffffff',
        borderDark: '#ffffff',
        disabled: '#ffffff',
        highlight: '#ffffff',
        indicator: '#ffffff',
        textLight: '#ffffff',
        textDark: '#ffffff',
      },
    },
  };
  return deleteCreate({
    input,
    deleteOperation: CrudApiMutationDocuments.deleteChain,
    createOperation: CrudApiMutationDocuments.createChain,
  });
};

export const createTestGroup = (chainIdx: number, groupIdx: number) => {
  const input: CrudApi.CreateGroupInput = {
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
    deleteOperation: CrudApiMutationDocuments.deleteGroup,
    createOperation: CrudApiMutationDocuments.createGroup,
  });
};

export const createTestUnit = (
  chainIdx: number,
  groupIdx: number,
  unitIdx: number,
) => {
  const input: CrudApi.CreateUnitInput = {
    id: generateUnitId(chainIdx, groupIdx, unitIdx),
    groupId: generateGroupId(chainIdx, groupIdx),
    chainId: generateChainId(chainIdx),
    isActive: true,
    isAcceptingOrders: true,
    name: `Test unit #${unitIdx}`,
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
        method: CrudApi.PaymentMethod.CASH,
        name: 'Cash',
      },
      {
        method: CrudApi.PaymentMethod.CARD,
        name: 'Card',
      },
      {
        method: CrudApi.PaymentMethod.INAPP,
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
    deleteOperation: CrudApiMutationDocuments.deleteUnit,
    createOperation: CrudApiMutationDocuments.createUnit,
  });
};

export const createTestProductCategory = (
  chainIdx: number,
  productCategoryId: number,
) => {
  const input: CrudApi.CreateProductCategoryInput = {
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
  };

  return deleteCreate({
    input,
    deleteOperation: CrudApiMutationDocuments.deleteProductCategory,
    createOperation: CrudApiMutationDocuments.createProductCategory,
  });
};

export const createTestChainProduct = (
  chainIdx: number,
  productCategoryIdx: number,
  productIdx: number,
) => {
  const input: CrudApi.CreateChainProductInput = {
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
  };
  return deleteCreate({
    input,
    deleteOperation: CrudApiMutationDocuments.deleteChainProduct,
    createOperation: CrudApiMutationDocuments.createChainProduct,
  });
};

export const createTestGroupProduct = (
  chainIdx: number,
  groupIdx: number,
  chainProductIdx: number,
  productIdx: number,
) => {
  const input: CrudApi.CreateGroupProductInput = {
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
    deleteOperation: CrudApiMutationDocuments.deleteGroupProduct,
    createOperation: CrudApiMutationDocuments.createGroupProduct,
  });
};

export const createTestUnitProduct = (
  chainIdx: number,
  groupIdx: number,
  unitIdx: number,
  groupProductIdx: number,
  productIdx: number,
) => {
  const input: CrudApi.CreateUnitProductInput = {
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
    deleteOperation: CrudApiMutationDocuments.deleteUnitProduct,
    createOperation: CrudApiMutationDocuments.createUnitProduct,
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
  const input: CrudApi.CreateCartInput = {
    id: generateCartId(cartIdx),
    userId: generateUserId(userIdx),
    unitId: generateUnitId(chainIdx, groupIdx, unitIdx),
    paymentMode: {
      name: 'INAPP',
      method: CrudApi.PaymentMethod.INAPP,
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
      },
    ],
  };
  return deleteCreate({
    input,
    deleteOperation: CrudApiMutationDocuments.deleteCart,
    createOperation: CrudApiMutationDocuments.createCart,
  });
};


export const createTestRoleContext = (roleContextIdx: number, chainIdx: number, groupIdx: number, unitIdx: number) => {
  const superuserInput: AmplifyApi.CreateRoleContextInput = {
    id: generateRoleContextId(roleContextIdx, EAdminRole.SUPERUSER),
    name: {
      hu: `Test SUPERUSER role context #${roleContextIdx}`,
      en: `Test SUPERUSER role context #${roleContextIdx}`,
    },
    role: EAdminRole.SUPERUSER,
    contextId: 'SU_CTX_ID'
  };

  const chainAdminInput: AmplifyApi.CreateRoleContextInput = {
    id: generateRoleContextId(roleContextIdx, EAdminRole.CHAIN_ADMIN),
    name: {
      hu: `Test CHAIN_ADMIN role context #${roleContextIdx}`,
      en: `Test CHAIN_ADMIN role context #${roleContextIdx}`,
    },
    role: EAdminRole.CHAIN_ADMIN,
    contextId: 'CA_CTX_ID',
    chainId: generateChainId(chainIdx)
  };

  const r3 = EAdminRole.GROUP_ADMIN;
  const groupAdminInput: AmplifyApi.CreateRoleContextInput = {
    id: generateRoleContextId(roleContextIdx, r3),
    name: {
      hu: `Test GROUP_ADMIN role context #${roleContextIdx}`,
      en: `Test GROUP_ADMIN role context #${roleContextIdx}`,
    },
    role: r3,
    contextId: 'GA_CTX_ID',
    chainId: generateChainId(chainIdx),
    groupId: generateGroupId(chainIdx, groupIdx)
  };

  const r4 = EAdminRole.UNIT_ADMIN;
  const unitAdminInput: AmplifyApi.CreateRoleContextInput = {
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
  const staffInput: AmplifyApi.CreateRoleContextInput = {
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

  return combineLatest([
    deleteCreate({
      input: superuserInput,
      deleteOperation: AmplifyApiMutationDocuments.deleteRoleContext,
      createOperation: AmplifyApiMutationDocuments.createRoleContext,
    }),
    deleteCreate({
      input: chainAdminInput,
      deleteOperation: AmplifyApiMutationDocuments.deleteRoleContext,
      createOperation: AmplifyApiMutationDocuments.createRoleContext,
    }),
    deleteCreate({
      input: groupAdminInput,
      deleteOperation: AmplifyApiMutationDocuments.deleteRoleContext,
      createOperation: AmplifyApiMutationDocuments.createRoleContext,
    }),
    deleteCreate({
      input: unitAdminInput,
      deleteOperation: AmplifyApiMutationDocuments.deleteRoleContext,
      createOperation: AmplifyApiMutationDocuments.createRoleContext,
    }),
    deleteCreate({
      input: staffInput,
      deleteOperation: AmplifyApiMutationDocuments.deleteRoleContext,
      createOperation: AmplifyApiMutationDocuments.createRoleContext,
    })
  ]);
};
