// Fixtures to import and modify in unit tests. They are gfeneral purpose
// fixtures, no implicit scenarios.

import {
  Allergen,
  CreateUnitInput,
  Order,
  OrderItem,
  OrderMode,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  PaymentType,
  PosType,
  ProductComponentSetType,
  ProductType,
  ServingMode,
  Transaction,
  Unit,
  UnpayCategory,
  User,
  UserInvoiceAddress,
} from '@bgap/domain';
import * as R from 'ramda';

const userInvoiceAddress: UserInvoiceAddress = {
  customerName: 'USER INVOICEADDRESS CUSTOMERNAME ',
  taxNumber: 'USER INVOICEADDRESS TAX NUMBER',
  country: 'USER INVOICEADDRESS COUNTRY',
  city: 'USER INVOICEADDRESS CITY',
  streetAddress: 'USER INVOICEADDRESS STREET ADDRESS',
  postalCode: 'USER INVOICEADDRESS POSTAL CODE',
  email: 'USER INVOICEADDRESS EMAIL',
};

const user: User = {
  id: 'USER ID',
  createdAt: 'USER CREATEDAT',
  updatedAt: 'USER UPDATEDAT',
  name: 'USER NAME',
  phone: 'USER PHONE',
  profileImage: 'USER PROFILE IMAGE',
  stripeCustomerId: 'USER STRIPE CUSTOMER ID',
  invoiceAddress: userInvoiceAddress,
};

const orderItem: OrderItem = {
  quantity: 1,
  productId: 'PRODUCT_ID',
  statusLog: [
    {
      userId: 'ORDERITEM STATUSLOG USERID',
      status: OrderStatus.none,
      ts: 12345,
    },
  ],
  sumPriceShown: {
    taxSum: 10,
    currency: 'ORDERITEM CURRENCY',
    tax: 11,
    priceSum: 100,
    pricePerUnit: 101,
  },
  productName: {
    hu: 'ORDER PRODUCTNAME HU',
    en: 'ORDER PRODUCTNAME EN',
    de: 'ORDER PRODUCTNAME DE',
  },
  allergens: [Allergen.egg],
  laneId: `ORDERITEM LANEID`,
  priceShown: {
    taxSum: 20,
    currency: 'ORDERITEM PRICESHOWN CURRENCY',
    tax: 21,
    priceSum: 200,
    pricePerUnit: 201,
  },
  variantId: 'ORDERITEM VARIANTID',
  variantName: {
    en: 'ORDERITEM VARIANTNAME EN',
    hu: 'ORDERITEM VARIANTNAME HU',
    de: 'ORDERITEM VARIANTNAME DE',
  },
  configSets: [
    {
      name: {
        de: 'ORDERITEM CONFIGSET DE',
        hu: 'ORDERITEM CONFIGSET HU',
        en: 'ORDERITEM CONFIGSET EN',
      },
      type: ProductComponentSetType.modifier,
      items: [
        {
          productComponentId: 'ORDERITEM PRODUCTCOMPONENT ID',
          name: {
            de: 'ORDERITEM CONFIGSET NAME DE',
            en: 'ORDERITEM CONFIGSET NAME DE',
            hu: 'ORDERITEM CONFIGSET NAME DE',
          },
          price: 400,
          allergens: [Allergen.gluten],
        },
      ],
      productSetId: `ORDERITEM PRODUCT SET ID`,
    },
  ],
  productType: ProductType.drink,
};

const transaction: Transaction = {
  id: 'TRANSACTION ID',
  createdAt: 'TRANSACTION CREATEDAT',
  updatedAt: 'TRANSACTION UPDATEDAT',
  currency: 'TRANSACTION CURRENCY',
  orderId: 'TRANSACTION ORDERID',
  userId: user.id,
  user,
  total: 0,
  type: 'TRANSACTION TYPE',
  externalTransactionId: 'TRANSACTION EXTERNAL TRANSACTION ID',
};

const order: Order = {
  id: 'ORDER_ID',
  createdAt: 'ORDER CREATEDAT',
  updatedAt: 'ORDER UPDATEDAT',
  userId: 'ORDER USERID',
  unitId: 'ORDER UNITID',
  orderNum: 'ORDER ORDERNUM',
  items: [orderItem],
  sumPriceShown: {
    taxSum: 30,
    currency: 'ORDER SUMPRICESHOWN CURRENCY',
    tax: 31,
    priceSum: 300,
    pricePerUnit: 301,
  },
  place: {
    table: 'ORDER TABLE',
    seat: 'ORDER SEAT',
  },
  orderMode: OrderMode.instant,
  servingMode: ServingMode.inplace,
  paymentMode: {
    type: PaymentType.stripe,
    caption: 'ORDER PAYMENTMODE CAPTION',
    method: PaymentMethod.inapp,
  },
  statusLog: [
    {
      userId: 'ORDER STATUSLOG USERID',
      status: OrderStatus.none,
      ts: 22222,
    },
  ],
  currentStatus: OrderStatus.none,
  archived: false,
  paymentIntention: 2.3,
  transactionStatus: PaymentStatus.waiting_for_payment,
  transactionId: 'ORDER TRANSACTIONID ',
  unpayCategory: UnpayCategory.other,
  serviceFee: {
    grossPrice: 400,
    taxContent: 40,
    currency: 'SERVICEFEE CURRENCY',
  },
  packagingSum: {
    netPrice: 500,
    taxPercentage: 50,
    currency: 'PACKAGINGSUM CURRENCY',
  },
};

const createUnitInput: CreateUnitInput = {
  id: 'UNITID',
  isActive: true,
  isAcceptingOrders: true,
  name: 'UNIT NAME',
  packagingTaxPercentage: 10,
  address: {
    address: 'UNIT ADDRESS',
    city: 'UNIT CITY',
    country: 'UNIT COUNTRY',
    title: 'UNTI TITLE',
    postalCode: 'UNIT POSTAL CODE',
    location: {
      lat: 47,
      lng: 19,
    },
  },
  location: {
    lat: 47,
    lon: 19,
  },
  description: {
    hu: `UNIT DESCRIPTION HU`,
    de: `UNIT DESCRIPTION DE`,
    en: `UNIT DESCRIPTION EN`,
  },
  paymentModes: [
    {
      method: PaymentMethod.cash,
      type: PaymentType.cash,
    },
  ],
  lanes: [
    {
      color: '#e72222',
      id: 'lane_01',
      name: 'bár',
    },
  ],
  open: {
    from: '1970-01-01',
    to: '2970-01-01',
  },
  supportedOrderModes: [OrderMode.pickup, OrderMode.instant],
  supportedServingModes: [ServingMode.inplace, ServingMode.takeaway],
  currency: 'EUR',
  style: {
    colors: {},
  },
};
const unit: Unit = {
  id: 'UNITID',
  createdAt: 'ORDER CREATEDAT',
  updatedAt: 'ORDER UPDATEDAT',
  chainId: 'UNIT CHAINID',
  groupId: 'UNIT GROUPID',
  isActive: true,
  isAcceptingOrders: true,
  name: 'UNIT NAME',
  packagingTaxPercentage: 10,
  address: {
    address: 'UNIT ADDRESS',
    city: 'UNIT CITY',
    country: 'UNIT COUNTRY',
    title: 'UNTI TITLE',
    postalCode: 'UNIT POSTAL CODE',
    location: {
      lat: 47,
      lng: 19,
    },
  },
  location: {
    lat: 47,
    lon: 19,
  },
  description: {
    hu: `UNIT DESCRIPTION HU`,
    de: `UNIT DESCRIPTION DE`,
    en: `UNIT DESCRIPTION EN`,
  },
  paymentModes: [
    {
      method: PaymentMethod.cash,
      type: PaymentType.cash,
    },
  ],
  lanes: [
    {
      color: '#e72222',
      id: 'lane_01',
      name: 'bár',
    },
  ],
  open: {
    from: '1970-01-01',
    to: '2970-01-01',
  },
  supportedOrderModes: [OrderMode.pickup, OrderMode.instant],
  supportedServingModes: [ServingMode.inplace, ServingMode.takeaway],
  style: {
    colors: {
      backgroundDark: '#d6dde0',
      backgroundLight: '#ffffff',
      borderDark: '#c3cacd',
      borderLight: '#e7e5d0',
      disabled: '#303030',
      indicator: '#30bf60',
      textDark: '#303030',
      textLight: '#ffffff',
      primary: '#30bf60', // indicator
      secondary: '#303030', // textDark
      button: '#30bf60',
      buttonText: '#fffffb',
      icon: '#30bf60',
      highlight: '#30bf60',
    },
  },
  currency: 'EUR',
};

const rkeeperUnit: Unit = {
  ...unit,
  pos: {
    type: PosType.rkeeper,
    rkeeper: {
      endpointUri: 'RKEEPER ENDPOINT URI',
      rkeeperUsername: 'RKEEPER USERNAME',
      rkeeperPassword: 'RKEEPER_PASSWORD',
      anyuppUsername: 'ANYUPP_USERNAME',
      anyuppPassword: 'ANYUPP_PASSWORD',
    },
  },
};

export const getUser = () => R.clone(user);
export const getOrder = () => R.clone(order);
export const getTransaction = () => R.clone(transaction);
export const getUnit = () => R.clone(unit);
export const getCreateUnitInput = () => R.clone(createUnitInput);
export const getRKeeperUnit = () => R.clone(rkeeperUnit);
