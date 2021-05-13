/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EProductType,
  EVariantAvailabilityType,
  IProduct,
  IProductVariant,
} from '@bgap/shared/types';
import { calculateActualPricesAndCheckActivity } from './calculate-product';
import { productSeed } from '@bgap/shared/fixtures';
import * as CrudApi from '@bgap/crud-gql/api';

describe('calculatePricesAndCheckActivity method', () => {
  const baseProduct: any = {
    // const baseProduct: IProduct = {
    ...productSeed.unitProductBase,
    tax: 11,
    name: { en: 'NAME' },
    description: { en: 'DESCRIPTION' },
    image: 'IMG',
    // , createdAt: "CREATED_AT",
    //  updatedAt: "UPDATED_AT",
    productCategoryId: 'PROD_CAT_ID',
    productType: EProductType.DRINK,
    //  chainId: 'CHAIN_ID',
    allergens: [CrudApi.Allergen.peanut, CrudApi.Allergen.egg],
  };
  const timezone01 = 'Europe/London';

  it('should return a minimal representation of the product in the correct format', () => {
    const notActiveVariant: IProductVariant = {
      ...baseProduct.variants[0],
      availabilities: [
        {
          dayFrom: '2020-07-17',
          dayTo: '2020-07-19',
          price: '2',
          timeFrom: '00:00',
          timeTo: '23:59',
          type: EVariantAvailabilityType.SEASONAL,
        },
      ],
    };
    const anotherActiveVariant: IProductVariant = {
      ...baseProduct.variants[0],
      position: 100,
    };
    const product: IProduct = {
      ...baseProduct,
      variants: [
        baseProduct.variants[0],
        notActiveVariant,
        anotherActiveVariant,
      ],
    };
    const result = calculateActualPricesAndCheckActivity({
      product,
      atTimeISO: new Date().toISOString(),
      inTimeZone: timezone01,
    });
    const activeVariantIdx = 0;

    expect(result).not.toBeUndefined();
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('image');
    expect(result).toHaveProperty('position', baseProduct.position);
    expect(result).toHaveProperty('tax', baseProduct.tax);
    expect(result).toHaveProperty('variants');
    expect(result?.variants.length).toEqual(2);
    expect(result?.variants[activeVariantIdx]).toHaveProperty('variantName');
    expect(result?.variants[activeVariantIdx]).toHaveProperty('price');
    expect(result?.variants[activeVariantIdx]).toHaveProperty(
      'position',
      product.variants[activeVariantIdx].position,
    );
    expect(result!.variants[activeVariantIdx]).toHaveProperty('pack', {
      size: product.variants[activeVariantIdx].pack.size,
      unit: product.variants[activeVariantIdx].pack.unit,
    });
    expect(result!.variants[activeVariantIdx]).not.toHaveProperty(
      'availabilities',
    );
    expect(result).toMatchInlineSnapshot(`
      Object {
        "allergens": Array [
          "peanut",
          "egg",
        ],
        "description": Object {
          "en": "DESCRIPTION",
        },
        "id": "test_chainProduct_id_",
        "image": "IMG",
        "name": Object {
          "en": "NAME",
        },
        "position": 1,
        "productCategoryId": "PROD_CAT_ID",
        "productType": "drink",
        "tax": 11,
        "unitId": "unitId_",
        "variants": Array [
          Object {
            "id": "test_chainProductVariant_id_1",
            "pack": Object {
              "size": 1,
              "unit": "UNIT",
            },
            "position": 1,
            "price": 1.5,
            "variantName": Object {
              "en": "VARIANT_NAME_1",
            },
          },
          Object {
            "id": "test_chainProductVariant_id_1",
            "pack": Object {
              "size": 1,
              "unit": "UNIT",
            },
            "position": 100,
            "price": 1.5,
            "variantName": Object {
              "en": "VARIANT_NAME_1",
            },
          },
        ],
      }
    `);
  });

  describe('isVisible', () => {
    it('should return the product in case the product is visible', () => {
      expect(
        calculateActualPricesAndCheckActivity({
          product: baseProduct,
          atTimeISO: new Date().toISOString(),
          inTimeZone: timezone01,
        }),
      ).toHaveProperty('name', baseProduct.name);
    });

    it('should return undefined in case the product is NOT visible', () => {
      expect(
        calculateActualPricesAndCheckActivity({
          product: { isVisible: false } as any,
          atTimeISO: new Date().toISOString(),
          inTimeZone: timezone01,
        }),
      ).toBeUndefined();
    });
  });
  describe('Variants', () => {
    describe('isAvailable', () => {
      it('should return undefined in case none of the variants are available', () => {
        const input = {
          ...baseProduct,
          variants: [
            { isAvailable: false } as any,
            { isAvailable: false } as any,
          ],
        };
        expect(
          calculateActualPricesAndCheckActivity({
            product: input as any,
            atTimeISO: new Date().toISOString(),
            inTimeZone: timezone01,
          }),
        ).toBeUndefined();
      });

      it('should remove the variant in case it is not Available', () => {
        const variant: IProductVariant = {
          id: 'VAR_ID',
          variantName: { en: 'variantName' },
          pack: { size: 1, unit: 'unit' },
          isAvailable: true,
          availabilities: [
            {
              dayFrom: '',
              dayTo: '',
              price: 2.2,
              timeFrom: '',
              timeTo: '',
              type: EVariantAvailabilityType.ALWAYS,
            },
          ],
          position: 999,
          refGroupPrice: 1,
        };
        const input = {
          ...baseProduct,
          variants: [variant, { ...variant, position: 2, isAvailable: false }],
        };

        const result = calculateActualPricesAndCheckActivity({
          product: input as any,
          atTimeISO: new Date().toISOString(),
          inTimeZone: timezone01,
        });

        expect(result).not.toBeUndefined();
        expect(result?.variants.length).toEqual(1);
        expect(result?.variants[0].position).toEqual(999);
      });
    });

    describe('calculate actual variant price for each variants', () => {
      const variant: IProductVariant = {
        id: 'VAR_ID',
        variantName: { en: 'variantName' },
        pack: { size: 1, unit: 'unit' },
        isAvailable: true,
        availabilities: [] as any,
        position: 1,
        refGroupPrice: 0,
      };
      const minimalProductWithSingleActiveVariant: Partial<IProduct> = {
        id: 'PROD_ID',
        isVisible: true,
        name: { en: 'prodName' },
        productCategoryId: 'productCategoryId',
        productType: EProductType.DRINK,
        description: { en: 'desc' },
        image: 'image',
        tax: 0,
        position: 2,
        variants: [{ ...variant }, { ...variant }],
      };

      it('should return undefined in case none of the variants have active availability', () => {
        const input = {
          ...minimalProductWithSingleActiveVariant,
        };
        expect(
          calculateActualPricesAndCheckActivity({
            product: input as any,
            atTimeISO: new Date().toISOString(),
            inTimeZone: timezone01,
          }),
        ).toBeUndefined();
      });

      it('should use the ALWAYS availability if there is no other', () => {
        const input = {
          ...minimalProductWithSingleActiveVariant,
        };

        input.variants![0].availabilities = [
          {
            dayFrom: '',
            dayTo: '',
            price: 2.2,
            timeFrom: '',
            timeTo: '',
            type: EVariantAvailabilityType.ALWAYS,
          },
        ];

        input.variants![1].availabilities = [
          {
            dayFrom: '',
            dayTo: '',
            price: 3.3,
            timeFrom: '',
            timeTo: '',
            type: EVariantAvailabilityType.ALWAYS,
          },
        ];
        const result = calculateActualPricesAndCheckActivity({
          product: input as any,
          atTimeISO: new Date().toISOString(),
          inTimeZone: timezone01,
        });
        expect(result).not.toBeUndefined();
        expect(result?.variants[0]).toHaveProperty('price', 2.2);
        expect(result?.variants[1]).toHaveProperty('price', 3.3);
      });
    });
  });
});
