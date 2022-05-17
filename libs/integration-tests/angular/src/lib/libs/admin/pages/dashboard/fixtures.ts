import * as CrudApi from '@bgap/crud-gql/api';

export const printableOrder = {
  id: 'seeded_order_id_6',
  createdAt: '2022-01-31T15:04:37.521Z',
  userId: 'seeded_user_id_6',
  unitId: 'seeded_unit_c1_g1_1_id',
  orderNum: '000001',
  items: [
    {
      productId: 'seeded_chain_product_c1_1_id',
      variantId: 'seeded_chain_product_variant_c1_p1_1_id',
      created: null,
      productName: {
        en: 'Hamburger',
        de: 'Hamburger',
        hu: 'Hamburger',
      },
      image: null,
      quantity: 5,
      statusLog: [
        {
          userId: 'test-alice',
          status: 'none',
          ts: 1627909024677,
        },
        {
          userId: 'test-alice',
          status: 'placed',
          ts: 1627909024677,
        },
      ],
      variantName: {
        en: 'normal',
        de: 'normal',
        hu: 'normál',
      },
      laneId: 'lane_01',
      allergens: ['egg', 'gluten', 'mustard', 'milk', 'soya', 'fish', 'sesame'],
      configSets: [
        {
          productSetId: 'test_product_component_set_id',
          name: {
            en: 'Modifier comp set',
            de: null,
            hu: 'Módosító komponens set',
          },
          type: CrudApi.ProductComponentSetType.modifier,
          items: [
            {
              productComponentId: 'test_product_component_id',
              price: -1.7999999999999998,
              name: {
                en: 'Room temperature',
                de: 'Room temperature',
                hu: 'Szobahőmérsékletű',
              },
              allergens: ['egg', 'gluten'],
              netPackagingFee: null,
            },
          ],
        },
      ],
      productType: CrudApi.ProductType.drink,
      externalId: null,
      netPackagingFee: null,
      serviceFee: null,
      priceShown: {
        currency: 'HUF',
        pricePerUnit: 300,
        priceSum: 1500,
        tax: 27,
        taxSum: 318.9,
      },
      sumPriceShown: {
        currency: 'HUF',
        pricePerUnit: 298.2,
        priceSum: 1491,
        tax: 27,
        taxSum: 316.98,
      },
    },
    {
      productId: 'seeded_chain_product_c1_2_id',
      variantId: '16853de0-528d-11ec-90c0-fdfe82b3802d',
      created: null,
      productName: {
        en: 'Fishburger',
        de: 'Fishburger',
        hu: 'Halburger',
      },
      image: null,
      quantity: 5,
      statusLog: [
        {
          userId: 'test-alice',
          status: 'none',
          ts: 1627909024677,
        },
        {
          userId: 'test-alice',
          status: 'placed',
          ts: 1627909024677,
        },
      ],
      variantName: {
        en: 'normal',
        de: 'normal',
        hu: 'normál',
      },
      laneId: 'lane_01',
      allergens: [
        'lupin',
        'molluscs',
        'crustaceans',
        'egg',
        'soya',
        'sesame',
        'fish',
        'gluten',
      ],
      configSets: [
        {
          productSetId: 'test_product_component_set_id',
          name: {
            en: 'Modifier comp set',
            de: null,
            hu: 'Módosító komponens set',
          },
          type: CrudApi.ProductComponentSetType.modifier,
          items: [
            {
              productComponentId: 'test_product_component_id',
              price: -1.7999999999999998,
              name: {
                en: 'Room temperature',
                de: 'Room temperature',
                hu: 'Szobahőmérsékletű',
              },
              allergens: ['egg', 'gluten'],
              netPackagingFee: null,
            },
          ],
        },
      ],
      productType: CrudApi.ProductType.drink,
      externalId: null,
      netPackagingFee: null,
      serviceFee: null,
      priceShown: {
        currency: 'HUF',
        pricePerUnit: 300,
        priceSum: 1500,
        tax: 27,
        taxSum: 318.9,
      },
      sumPriceShown: {
        currency: 'HUF',
        pricePerUnit: 298.2,
        priceSum: 1491,
        tax: 27,
        taxSum: 316.98,
      },
    },
    {
      productId: 'seeded_chain_product_c1_3_id',
      variantId: 'd22dee40-528b-11ec-afe3-15e1afd659e2',
      created: null,
      productName: {
        en: 'Sajtburger',
        de: 'Sajtburger',
        hu: 'Sajtburger',
      },
      image: null,
      quantity: 5,
      statusLog: [
        {
          userId: 'test-alice',
          status: 'none',
          ts: 1627909024677,
        },
        {
          userId: 'test-alice',
          status: 'placed',
          ts: 1627909024677,
        },
      ],
      variantName: {
        en: 'normal',
        de: 'normal',
        hu: 'normál',
      },
      laneId: 'lane_01',
      allergens: ['sesame'],
      configSets: [
        {
          productSetId: 'test_product_component_set_id',
          name: {
            en: 'Modifier comp set',
            de: null,
            hu: 'Módosító komponens set',
          },
          type: CrudApi.ProductComponentSetType.modifier,
          items: [
            {
              productComponentId: 'test_product_component_id',
              price: -1.7999999999999998,
              name: {
                en: 'Room temperature',
                de: 'Room temperature',
                hu: 'Szobahőmérsékletű',
              },
              allergens: ['egg', 'gluten'],
              netPackagingFee: null,
            },
          ],
        },
      ],
      productType: CrudApi.ProductType.drink,
      externalId: null,
      netPackagingFee: null,
      serviceFee: null,
      priceShown: {
        currency: 'HUF',
        pricePerUnit: 300,
        priceSum: 1500,
        tax: 27,
        taxSum: 318.9,
      },
      sumPriceShown: {
        currency: 'HUF',
        pricePerUnit: 298.2,
        priceSum: 1491,
        tax: 27,
        taxSum: 316.98,
      },
    },
  ],
  paymentMode: {
    type: 'cash',
    caption: null,
    method: 'cash',
  },
  statusLog: [
    {
      userId: 'test-alice',
      status: 'placed',
      ts: 1627909024677,
    },
  ],
  archived: false,
  takeAway: false,
  place: {
    seat: '02',
    table: '01',
  },
  paymentIntention: null,
  transactionStatus: 'success',
  transactionId: 'seeded_transaction_id_6',
  unpayCategory: null,
  orderMode: 'instant',
  servingMode: 'inPlace',
  serviceFee: {
    currency: 'HUF',
    netPrice: 200,
    taxPercentage: 27,
  },
  packagingSum: null,
  sumPriceShown: {
    currency: 'HUF',
    pricePerUnit: 298.2,
    priceSum: 2982,
    tax: 27,
    taxSum: 633.96,
  },
  rating: {
    key: 'RATING KEY',
    value: 3,
  },
  hasRated: true,
  tip: null,
  tipTransactionStatus: null,
  tipTransactionId: null,
  updatedAt: '2022-01-31T15:04:37.521Z',
  transaction: {
    id: 'seeded_transaction_id_6',
    userId: 'test-alice',
    orderId: 'seeded_order_id_6',
    type: 'cash',
    total: 0,
    currency: 'HUF',
    status: 'waiting_for_payment',
    externalTransactionId: null,
    invoiceId: null,
    receiptId: null,
    createdAt: '2022-01-31T15:04:37.267Z',
    updatedAt: '2022-01-31T15:04:37.267Z',
    paymentMethodId: null,
    user: {
      id: 'test-alice',
      name: 'Mekk Elek',
      email: 'testuser+alice@anyupp.com',
      phone: '1234',
      profileImage: null,
      stripeCustomerId: null,
      invoiceAddress: null,
      createdAt: '2022-01-31T15:04:19.739Z',
      updatedAt: '2022-01-31T15:04:19.739Z',
    },
    invoice: null,
    receipt: null,
  },
  tipTransaction: null,
};
