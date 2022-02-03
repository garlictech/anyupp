/* eslint-disable @typescript-eslint/no-explicit-any */
import * as CrudApi from '@bgap/crud-gql/api';
import { tap } from 'rxjs/operators';
import { sendRkeeperOrder } from './send-order';

/* A reference JSON that the stuff must produce:
{
  remoteid: '109150001',
  objectid: '109150001',
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
  CreateTime: '2022-02-02T12:00:39',
};
 */

const orderInput: CrudApi.CreateOrderInput = {
  userId: 'USER_ID',
  unitId: 'rkeeper-cf0d1110-a2ce-45cf-aa69-6782bbc44cad-unit',
  items: [
    {
      quantity: 5,
      productId: 'PRODUCT ID',
      statusLog: [],
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
          type: 'CONFIG SET TYPE',
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
          type: 'CONFIG SET TYPE 2',
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
  orderMode: CrudApi.OrderMode.instant,
  servingMode: CrudApi.ServingMode.inplace,
  archived: false,
  orderNum: 'ORDERNUM',
  paymentMode: {
    method: CrudApi.PaymentMethod.cash,
    type: CrudApi.PaymentType.cash,
  },
  statusLog: [],
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

test('Convert Anyupp order to rkeeper order', done => {
  const deps: any = {
    axiosInstance: {
      request: jest.fn().mockReturnValue(Promise.resolve({})),
    },
    currentTime: () => new Date('2022.02.01'),
  };

  sendRkeeperOrder(deps)(unit, orderInput)
    .pipe(
      tap(() =>
        expect(deps.axiosInstance.request.mock.calls).toMatchSnapshot(),
      ),
    )
    .subscribe(() => done());
});
