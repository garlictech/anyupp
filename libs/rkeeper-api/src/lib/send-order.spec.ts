/* eslint-disable @typescript-eslint/no-explicit-any */
import { tap } from 'rxjs/operators';
import { sendRkeeperOrder } from './send-order';

const orderInput: any = {
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
  orderMode: 'instant',
  servingMode: 'inPlace',
  archived: false,
  orderNum: 'ORDERNUM',
  paymentMode: {
    method: 'cash',
    type: 'cash',
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
    },
  },
};

test('Send rkeeper order without modifiers', done => {
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

test('Send rkeeper order with modifiers', done => {
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
