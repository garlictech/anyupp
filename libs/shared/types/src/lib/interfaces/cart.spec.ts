import { ICart, isCart, validateCart } from './cart';
import { AmplifyApi } from '@bgap/admin/amplify-api';

const cart: ICart = {
  id: 'ID',
  userId: 'USERID',
  unitId: 'UNITID',
  paymentMode: {
    method: AmplifyApi.PaymentMethod.CARD,
    name: 'CARD',
  },
  takeAway: false,
  items: [
    {
      created: 100,
      productName: { en: 'EN' },
      priceShown: {
        currency: 'HUF',
        pricePerUnit: 100,
        priceSum: 100,
        tax: 100,
        taxSum: 100,
      },
      productId: 'PRODUCTID',
      quantity: 100,
      statusLog: [],
      variantId: 'VARIANTID',
      variantName: { en: 'EN' },
      laneId: 'LANEID',
    },
  ],
  createdAt: 'CREATEDAT',
  updatedAt: 'UPDATEDAT',
  place: { seat: 'SEAT', table: 'TABLE' },
};

describe('Cart validaton test', () => {
  it('should be valid', async () => {
    expect(await validateCart(cart).toPromise()).toMatchInlineSnapshot(`
      Object {
        "createdAt": "CREATEDAT",
        "id": "ID",
        "items": Array [
          Object {
            "created": 100,
            "laneId": "LANEID",
            "priceShown": Object {
              "currency": "HUF",
              "pricePerUnit": 100,
              "priceSum": 100,
              "tax": 100,
              "taxSum": 100,
            },
            "productId": "PRODUCTID",
            "productName": Object {
              "en": "EN",
            },
            "quantity": 100,
            "statusLog": Array [],
            "variantId": "VARIANTID",
            "variantName": Object {
              "en": "EN",
            },
          },
        ],
        "paymentMode": Object {
          "method": "CARD",
          "name": "CARD",
        },
        "place": Object {
          "seat": "SEAT",
          "table": "TABLE",
        },
        "takeAway": false,
        "unitId": "UNITID",
        "updatedAt": "UPDATEDAT",
        "userId": "USERID",
      }
    `);
    expect(isCart(cart)).toEqual(true);
  });

  it('should be inValid', async () => {
    const { id, ...invalidCart } = cart;
    await validateCart(invalidCart)
      .toPromise()
      .catch(error => {
        expect(error).toMatchInlineSnapshot(
          `"Cart Object Validation Error: \\"id\\" is required"`,
        );
      });
    expect(isCart(invalidCart)).toEqual(false);
  });
});
