/* eslint-disable @typescript-eslint/no-explicit-any */
import { of } from 'rxjs';
import { addPackagingFeeToOrder } from './handle-packaging-fee';

const useCases = [
  {
    label: 'add package fee',
    productId: 'PRODUCTID',
    sdk: {
      GetUnitProduct: jest.fn().mockReturnValue(
        of({
          variants: {
            items: [
              {
                id: 'VARIANTID',
                netPackagingFee: 1,
              },
              {
                id: 'OTHER_VARIANTID',
                netPackagingFee: 2,
              },
              {
                id: 'UNUSED_VARIANTID',
                netPackagingFee: 3,
              },
            ],
          },
          configSets: [
            {
              productSetId: 'PRODUCTSETID1',
              items: [
                {
                  productComponentId: 'PRODUCTCOMPONENTID1',
                  netPackagingFee: 4,
                },
              ],
            },
            {
              productSetId: 'PRODUCTSETID2',
              items: [
                {
                  productComponentId: 'PRODUCTCOMPONENTID2',
                  netPackagingFee: -1,
                },
              ],
            },
          ],
        }),
      ),
    },
  },
  {
    label: 'variant not found',
    productId: 'PRODUCTID2',
    sdk: {
      GetUnitProduct: jest.fn().mockReturnValue(
        of({
          variants: {
            items: [
              {
                id: 'OTHER_VARIANTID',
                netPackagingFee: 2,
              },
              {
                id: 'UNUSED_VARIANTID',
                netPackagingFee: 3,
              },
            ],
          },
          configSets: [
            {
              productSetId: 'PRODUCTSETID1',
              items: [
                {
                  productComponentId: 'PRODUCTCOMPONENTID1',
                  netPackagingFee: 4,
                },
              ],
            },
            {
              productSetId: 'PRODUCTSETID2',
              items: [
                {
                  productComponentId: 'PRODUCTCOMPONENTID2',
                  netPackagingFee: -1,
                },
              ],
            },
          ],
        }),
      ),
    },
  },
  {
    label: 'packaging fee of variant not given',
    productId: 'PRODUCTID3',
    sdk: {
      GetUnitProduct: jest.fn().mockReturnValue(
        of({
          variants: {
            items: [
              {
                id: 'VARIANTID',
              },
              {
                id: 'OTHER_VARIANTID',
              },
            ],
          },
          configSets: [
            {
              productSetId: 'PRODUCTSETID1',
              items: [
                {
                  productComponentId: 'PRODUCTCOMPONENTID1',
                },
              ],
            },
          ],
        }),
      ),
    },
  },
  {
    label: 'config set not found',
    productId: 'PRODUCTID4',
    sdk: {
      GetUnitProduct: jest.fn().mockReturnValue(
        of({
          variants: {
            items: [
              {
                id: 'VARIANTID',
              },
              {
                id: 'OTHER_VARIANTID',
              },
            ],
          },
          configSets: [
            {
              productSetId: 'PRODUCTSETID_OTHER',
              items: [
                {
                  productComponentId: 'PRODUCTCOMPONENTID1',
                },
              ],
            },
          ],
        }),
      ),
    },
  },
  {
    label: 'component not found',
    productId: 'PRODUCTID5',
    sdk: {
      GetUnitProduct: jest.fn().mockReturnValue(
        of({
          variants: {
            items: [
              {
                id: 'VARIANTID',
              },
              {
                id: 'OTHER_VARIANTID',
              },
            ],
          },
          configSets: [
            {
              productSetId: 'PRODUCTSETID1',
              items: [
                {
                  productComponentId: 'OTRHER_PRODUCTCOMPONENTID1',
                },
              ],
            },
          ],
        }),
      ),
    },
  },
  {
    label: 'no config sets',
    productId: 'PRODUCTID6',
    sdk: {
      GetUnitProduct: jest.fn().mockReturnValue(
        of({
          variants: {
            items: [
              {
                id: 'VARIANTID',
              },
              {
                id: 'OTHER_VARIANTID',
              },
            ],
          },
        }),
      ),
    },
  },
];

test.each(useCases)(
  'Adding package fee',
  ({ label, sdk, productId }, done: any) => {
    addPackagingFeeToOrder(sdk as any)(
      {
        id: 'ORDERID',
        items: [
          {
            variantId: 'VARIANTID',
            productId,
            quantity: 1,
            netPackagingFee: -1,
            configSets: [
              {
                productSetId: 'PRODUCTSETID1',
                items: [
                  {
                    productComponentId: 'PRODUCTCOMPONENTID1',
                  },
                ],
              },
            ],
          },
          {
            variantId: 'OTHER_VARIANTID',
            productId: 'OTHER_PRODUCTID',
            quantity: 1,
            netPackagingFee: -2,
          },
        ],
        sumPriceShown: {
          currency: 'HUF',
          priceSum: 100,
          taxSum: 10,
        },
      } as any,
      'HUF',
      10,
    ).subscribe({
      next: res => expect(res).toMatchSnapshot(label),
      error: res => {
        expect(res).toMatchSnapshot(label);
        done();
      },
      complete: () => {
        expect(sdk.GetUnitProduct.mock.calls).toMatchSnapshot(
          `GetUnitProduct calls (${label})`,
        );
        done();
      },
    });
  },
);
