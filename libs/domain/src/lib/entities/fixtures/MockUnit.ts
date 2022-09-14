import {
  Unit,
  OrderPaymentPolicy,
  PaymentMethod,
  PaymentType,
  ServingMode,
  OrderMode,
} from '../models';

export const mockUnit: Unit = {
  id: 'dummy_unit_id',
  createdAt: '2021-08-02T01:54:11.843Z',
  updatedAt: '2021-08-02T01:54:11.843Z',
  isActive: true,
  isAcceptingOrders: true,
  name: `Késdobáló S`,
  packagingTaxPercentage: 27,
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
  location: {
    lat: 47,
    lon: 19,
  },
  description: {
    hu: `Teszt unit #dummy_unit_id leírás`,
    en: `Test unit #dummy_unit_id description`,
  },
  orderPaymentPolicy: OrderPaymentPolicy.prepay,
  paymentModes: [
    {
      method: PaymentMethod.cash,
      type: PaymentType.cash,
    },
    {
      method: PaymentMethod.card,
      type: PaymentType.card,
    },
    {
      method: PaymentMethod.inapp,
      type: PaymentType.stripe,
    },
  ],
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
  open: {
    from: '1970-01-01',
    to: '2970-01-01',
  },
  supportedOrderModes: [OrderMode.pickup, OrderMode.instant],
  supportedServingModes: [ServingMode.inplace, ServingMode.takeaway],
  currency: 'HUF',
  style: {
    colors: {},
  },
};
