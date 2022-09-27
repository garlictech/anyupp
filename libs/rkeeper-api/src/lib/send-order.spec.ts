/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CreateOrderInput,
  OrderMode,
  OrderStatus,
  PaymentMethod,
  PaymentType,
  ProductComponentSetType,
  ServingMode,
} from '@bgap/domain';
import { sendRkeeperOrder } from './send-order';

/* A reference JSON that the stuff must produce:
{
  remoteid: 'yellow-id',
  objectid: 'yellow-id',
  delivery_time: '2022-02-02T12:00:39',
  comment: '',
  order_type: 1,
  pay_type: 0,
  pay_online_type: 0,
  client: { phone: '+36 70 336-6222', ln: 'Imi', fn: 'Teszt1' },
  address: {
    country: 'Magyarország',
    city: 'Budapest III',
    street: 'Teszt',
    house: '11',
    floor: '',
    building: '',
    entry: '',
    apartments: '',
    zip: '1039',
  },
  order: [
    {
      id: '1002016',
      qnt: 1000,
      type: 'd',
      items: [{ id: 1001455, qnt: 1000, type: 'm', items: [] }],
    },
    { id: '1006594', qnt: 1000, type: 'd', items: [] },
  ],
  crmData: { Holder_ID: '10000000001686', Address_ID: '10000000000131' },
  order_number: 193,
  guest_label: "Guest",
  guest_label: 1
};
 */

const orderInputTemplate: CreateOrderInput = {
  userId: 'USER_ID',
  unitId: 'rkeeper-cf0d1110-a2ce-45cf-aa69-6782bbc44cad-unit',
  items: [
    {
      quantity: 5,
      productId: 'PRODUCT ID',
      statusLog: [
        {
          userId: 'USER_ID',
          status: OrderStatus.none,
          ts: 1627909024677,
        },
      ],
      sumPriceShown: {
        taxSum: 316.98,
        currency: 'HUF',
        tax: 27,
        priceSum: 1491,
        pricePerUnit: 298.2,
      },
      productName: {
        hu: 'PRODUCT NAME HU',
      },
      priceShown: {
        taxSum: 318.9,
        currency: 'HUF',
        tax: 27,
        priceSum: 1500,
        pricePerUnit: 300,
      },
      variantId: 'VARIANT ID',
      variantName: {
        en: 'VARIANT NAME EN',
      },
      externalId: 'ITEM_EXTERNAL_ID',
      configSets: [
        {
          name: {
            en: 'CONFIG SET NAME',
          },
          type: ProductComponentSetType.modifier,
          productSetId: 'PRODUCT SET ID',
          items: [
            {
              productComponentId: 'PRODUCT COMPONENT ID',
              price: 1000,
              name: {
                en: 'PRODUCT COMPONENT NAME',
              },
              externalId: 'PRODUCT COMPONENT EXTERNAL ID',
            },
          ],
        },
        {
          name: {
            en: 'CONFIG SET NAME 2',
          },
          type: ProductComponentSetType.modifier,
          productSetId: 'PRODUCT SET ID',
          items: [
            {
              productComponentId: 'PRODUCT COMPONENT ID 2',
              price: 1000,
              name: {
                en: 'PRODUCT COMPONENT NAME 2',
              },
              externalId: 'PRODUCT COMPONENT EXTERNAL ID 2',
            },
          ],
        },
      ],
    },
  ],
  sumPriceShown: {
    taxSum: 633.96,
    currency: 'HUF',
    tax: 27,
    priceSum: 2982,
    pricePerUnit: 298.2,
  },
  place: {
    table: '01',
    seat: '01',
  },
  orderMode: OrderMode.instant,
  servingMode: ServingMode.inplace,
  archived: false,
  paymentMode: {
    method: PaymentMethod.cash,
    type: PaymentType.cash,
  },
};

const unit: any = {
  phone: 'UNIT_PHONE',
  email: 'UNIT_EMAIL',
  externalId: 'UNIT_EXTERNALID',
  pos: {
    rkeeper: {
      rkeeperUsername: 'RKEEPER_USERNAME',
      rkeeperPassword: 'RKEEPER_PASSWORD',
      endpointUri: 'https://RKEEPER_ENDPOINT',
    },
  },
};

const testCases = [
  {
    label: 'Unknown guest label',
    orderInput: orderInputTemplate,
  },
  {
    label: 'Known guest label',
    orderInput: {
      ...orderInputTemplate,

      guestLabel: 'GUEST LABEL',
    },
  },
];

const mockSuccessResponse = {
  success: true,
  data: {
    remoteResponse: {
      remoteOrderId: 72562,
    },
    data: {
      seq_number: 771,
      visit_id: '1656509181-606-109150001',
    },
    source: 'endpoint_server',
    status: 'Ok',
  },
};

test.each(testCases)('Test: $label', ({ orderInput }, done: any) => {
  const deps: any = {
    axiosInstance: {
      request: jest.fn().mockReturnValue(
        Promise.resolve({
          data: mockSuccessResponse,
        }),
      ),
    },
    currentTimeISOString: () =>
      new Date('2020-04-13T00:00:00.000+08:00').toISOString(),
    uuidGenerator: () => 'UUID',
  };

  sendRkeeperOrder(deps)(unit, orderInput).subscribe({
    next: sendRkeeperOrderResponse => {
      expect(deps.axiosInstance.request.mock.calls).toMatchSnapshot();
      expect(sendRkeeperOrderResponse).toMatchSnapshot();
    },
    complete: () => done(),
    error: err => {
      console.log('Error in test', err);
      done();
    },
  });
});
