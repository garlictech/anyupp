// Fixtures to import and modify in unit tests. They are gfeneral purpose
// fixtures, no implicit scenarios.
import * as CrudApi from '@bgap/crud-gql/api';
import * as R from 'ramda';

const userInvoiceAddress: CrudApi.UserInvoiceAddress = {
  customerName: 'USER INVOICEADDRESS CUSTOMERNAME ',
  taxNumber: 'USER INVOICEADDRESS TAX NUMBER',
  country: 'USER INVOICEADDRESS COUNTRY',
  city: 'USER INVOICEADDRESS CITY',
  streetAddress: 'USER INVOICEADDRESS STREET ADDRESS',
  postalCode: 'USER INVOICEADDRESS POSTAL CODE',
  email: 'USER INVOICEADDRESS EMAIL',
};

const user: CrudApi.User = {
  id: 'USER ID',
  createdAt: 'USER CREATEDAT',
  updatedAt: 'USER UPDATEDAT',
  name: 'USER NAME',
  phone: 'USER PHONE',
  profileImage: 'USER PROFILE IMAGE',
  stripeCustomerId: 'USER STRIPE CUSTOMER ID',
  invoiceAddress: userInvoiceAddress,
};

const orderItem: CrudApi.OrderItem = {
  quantity: 1,
  productId: 'PRODUCT_ID',
  statusLog: [
    {
      userId: 'ORDERITEM STATUSLOG USERID',
      status: CrudApi.OrderStatus.none,
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
  allergens: [CrudApi.Allergen.egg],
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
      type: 'ORDERITEM CONFIGSET TYPE',
      items: [
        {
          productComponentId: 'ORDERITEM PRODUCTCOMPONENT ID',
          name: {
            de: 'ORDERITEM CONFIGSET NAME DE',
            en: 'ORDERITEM CONFIGSET NAME DE',
            hu: 'ORDERITEM CONFIGSET NAME DE',
          },
          price: 400,
          allergens: [CrudApi.Allergen.gluten],
        },
      ],
      productSetId: `ORDERITEM PRODUCT SET ID`,
    },
  ],
  productType: 'ORDERITEM PRODUCT TYPE',
};

const transaction: CrudApi.Transaction = {
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

const order: CrudApi.Order = {
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
  orderMode: CrudApi.OrderMode.instant,
  servingMode: CrudApi.ServingMode.inplace,
  paymentMode: {
    type: CrudApi.PaymentType.stripe,
    caption: 'ORDER PAYMENTMODE CAPTION',
    method: CrudApi.PaymentMethod.inapp,
  },
  statusLog: [
    {
      userId: 'ORDER STATUSLOG USERID',
      status: CrudApi.OrderStatus.none,
      ts: 22222,
    },
  ],
  currentStatus: CrudApi.OrderStatus.none,
  archived: false,
  paymentIntention: 2.3,
  transactionStatus: CrudApi.PaymentStatus.waiting_for_payment,
  transactionId: 'ORDER TRANSACTIONID ',
  unpayCategory: CrudApi.UnpayCategory.other,
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

const createUnitInput: CrudApi.CreateUnitInput = {
  id: 'UNITID',
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
      method: CrudApi.PaymentMethod.cash,
      type: CrudApi.PaymentType.cash,
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
  supportedOrderModes: [CrudApi.OrderMode.pickup, CrudApi.OrderMode.instant],
  supportedServingModes: [
    CrudApi.ServingMode.inplace,
    CrudApi.ServingMode.takeaway,
  ],
};
const unit: CrudApi.Unit = {
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
      method: CrudApi.PaymentMethod.cash,
      type: CrudApi.PaymentType.cash,
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
  supportedOrderModes: [CrudApi.OrderMode.pickup, CrudApi.OrderMode.instant],
  supportedServingModes: [
    CrudApi.ServingMode.inplace,
    CrudApi.ServingMode.takeaway,
  ],
};

const rkeeperUnit: CrudApi.Unit = {
  ...unit,
  pos: {
    type: CrudApi.PosType.rkeeper,
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
