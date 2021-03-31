import { pipe } from 'fp-ts/lib/function';
import { from, throwError } from 'rxjs';

import API, { graphqlOperation } from '@aws-amplify/api-graphql';
import { EProductType } from '@bgap/shared/types';
import {
  AmplifyApi,
  AmplifyApiMutationDocuments,
} from '@bgap/admin/amplify-api';

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

export const createTestChain = (chainIdx: number) => {
  const input: AmplifyApi.CreateChainInput = {
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
        backgroundLight: '#fff',
        backgroundDark: '#fff',
        borderLight: '#fff',
        borderDark: '#fff',
        disabled: '#fff',
        highlight: '#fff',
        indicator: '#fff',
        textLight: '#fff',
        textDark: '#fff',
      },
    },
  };
  return pipe(
    API.graphql(
      graphqlOperation(AmplifyApiMutationDocuments.createChain, {
        input,
      }),
    ),
    operation =>
      operation instanceof Promise
        ? from(operation)
        : throwError('Wrong graphql operation'),
  );
};

export const createTestGroup = (chainIdx: number, groupIdx: number) => {
  const input: AmplifyApi.CreateGroupInput = {
    id: generateGroupId(chainIdx, groupIdx),
    chainId: generateChainId(chainIdx),
    name: `Test group #${groupIdx}`,
    description: {
      hu: `Teszt group #${groupIdx} leírás`,
      en: `Test group #${groupIdx} description`,
    },
    currency: groupIdx % 2 === 0 ? 'HUF' : 'EUR',
  };
  return pipe(
    API.graphql(
      graphqlOperation(AmplifyApiMutationDocuments.createGroup, {
        input,
      }),
    ),
    operation =>
      operation instanceof Promise
        ? from(operation)
        : throwError('Wrong graphql operation'),
  );
};

export const createTestUnit = (
  chainIdx: number,
  groupIdx: number,
  unitIdx: number,
) => {
  const input: AmplifyApi.CreateUnitInput = {
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
        lat: '47',
        lng: '19',
      },
    },
    description: {
      hu: `Teszt unit #${unitIdx} leírás`,
      en: `Test unit #${unitIdx} description`,
    },
    paymentModes: [
      {
        method: AmplifyApi.PaymentMethod.CASH,
        name: 'Cash',
      },
      {
        method: AmplifyApi.PaymentMethod.CARD,
        name: 'Card',
      },
      {
        method: AmplifyApi.PaymentMethod.INAPP,
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

  return pipe(
    API.graphql(
      graphqlOperation(AmplifyApiMutationDocuments.createUnit, {
        input,
      }),
    ),
    operation =>
      operation instanceof Promise
        ? from(operation)
        : throwError('Wrong graphql operation'),
  );
};

export const createTestProductCategory = (
  chainIdx: number,
  productCategoryId: number,
) => {
  const input: AmplifyApi.CreateProductCategoryInput = {
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
  return pipe(
    API.graphql(
      graphqlOperation(AmplifyApiMutationDocuments.createProductCategory, {
        input,
      }),
    ),
    operation =>
      operation instanceof Promise
        ? from(operation)
        : throwError('Wrong graphql operation'),
  );
};

export const createTestChainProduct = (
  chainIdx: number,
  productCategoryIdx: number,
  productIdx: number,
) => {
  const input: AmplifyApi.CreateChainProductInput = {
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

  return pipe(
    API.graphql(
      graphqlOperation(AmplifyApiMutationDocuments.createChainProduct, {
        input,
      }),
    ),
    operation =>
      operation instanceof Promise
        ? from(operation)
        : throwError('Wrong graphql operation'),
  );
};

export const createTestGroupProduct = (
  chainIdx: number,
  groupIdx: number,
  chainProductIdx: number,
  productIdx: number,
) => {
  const input: AmplifyApi.CreateGroupProductInput = {
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
  return pipe(
    API.graphql(
      graphqlOperation(AmplifyApiMutationDocuments.createGroupProduct, {
        input,
      }),
    ),
    operation =>
      operation instanceof Promise
        ? from(operation)
        : throwError('Wrong graphql operation'),
  );
};
export const createTestUnitProduct = (
  chainIdx: number,
  groupIdx: number,
  unitIdx: number,
  groupProductIdx: number,
  productIdx: number,
) => {
  const input: AmplifyApi.CreateUnitProductInput = {
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

  return pipe(
    API.graphql(
      graphqlOperation(AmplifyApiMutationDocuments.createUnitProduct, {
        input,
      }),
    ),
    operation =>
      operation instanceof Promise
        ? from(operation)
        : throwError('Wrong graphql operation'),
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
}) => {
  const input: AmplifyApi.CreateCartInput = {
    id: generateCartId(cartIdx),
    userId: generateUserId(userIdx),
    unitId: generateUnitId(chainIdx, groupIdx, unitIdx),
    paymentMode: {
      name: 'INAPP',
      method: AmplifyApi.PaymentMethod.INAPP,
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

  return pipe(
    API.graphql(
      graphqlOperation(AmplifyApiMutationDocuments.createCart, {
        input,
      }),
    ),
    operation =>
      operation instanceof Promise
        ? from(operation)
        : throwError('Wrong graphql operation'),
  );
};
