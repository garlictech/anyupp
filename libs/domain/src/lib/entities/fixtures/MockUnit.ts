import { CrudApi } from '../models';

export const mockUnit: CrudApi.Unit = {
  id: 'dummy_unit_id',
  groupId: 'dummy_group_id',
  chainId: 'dummy_chain_id',
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
  orderPaymentPolicy: CrudApi.OrderPaymentPolicy.prepay,
  paymentModes: [
    {
      method: CrudApi.PaymentMethod.cash,
      type: CrudApi.PaymentType.cash,
    },
    {
      method: CrudApi.PaymentMethod.card,
      type: CrudApi.PaymentType.card,
    },
    {
      method: CrudApi.PaymentMethod.inapp,
      type: CrudApi.PaymentType.stripe,
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
  supportedOrderModes: [CrudApi.OrderMode.pickup, CrudApi.OrderMode.instant],
  supportedServingModes: [
    CrudApi.ServingMode.inplace,
    CrudApi.ServingMode.takeaway,
  ],
};
