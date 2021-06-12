/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EProductType,
  EVariantAvailabilityType,
  Product,
  ProductComponentMap,
  ProductComponentSetMap,
} from '@bgap/shared/types';
import {
  calculateActualPricesAndCheckActivity,
  toCreateGeneratedProductInputType,
} from './calculate-product';
import * as CrudApi from '@bgap/crud-gql/api';

describe('calculatePricesAndCheckActivity method', () => {
  const baseProduct: Product = {
    id: 'PRODUCT_ID',
    chainId: 'CHAIN_ID',
    groupId: 'GROUP_ID',
    unitId: 'UNIT_ID',
    tax: 11,
    name: { en: 'NAME' },
    description: { en: 'DESCRIPTION' },
    image: 'IMG',
    createdAt: 'CREATED_AT',
    updatedAt: 'UPDATED_AT',
    productCategoryId: 'PROD_CAT_ID',
    productType: EProductType.DRINK,
    position: 1,
    isVisible: true,
    allergens: [CrudApi.Allergen.peanut, CrudApi.Allergen.egg],
    variants: [
      {
        id: `VARIANT_ID_01`,
        variantName: { en: `VARIANT_NAME_01` },
        refGroupPrice: 1,
        isAvailable: true,
        pack: { size: 1, unit: 'UNIT' },
        price: 1,
        availabilities: [
          {
            dayFrom: '',
            dayTo: '',
            price: 1 * 1.5,
            timeFrom: '',
            timeTo: '',
            type: EVariantAvailabilityType.ALWAYS,
          },
        ],
        position: 1,
      },
    ],
    configSets: [
      {
        productSetId: 'PROUDCT_SET_01',
        items: [
          {
            productComponentId: 'PRODUCT_COMPONENT_ID_01',
            refGroupPrice: 1,
            price: 1,
            position: 1,
          },
          {
            productComponentId: 'PRODUCT_COMPONENT_ID_02',
            refGroupPrice: 2,
            price: 2,
            position: 2,
          },
        ],
        position: 1,
      },
    ],
  };
  const prodComponentMap: ProductComponentMap = {
    'PRODUCT_COMPONENT_ID_01': {
      id: 'PRODUCT_COMPONENT_ID_01',
      chainId: 'CHAIN_ID',
      name: { en: 'PRODUCT_COMP_NAME' },
      description: 'PRODUCT_COMP_DESC',
      allergens: [CrudApi.Allergen.egg, CrudApi.Allergen.fish],
      createdAt: 'CREATED_AT',
      updatedAt: 'UPDATED_AT',
    },
    'PRODUCT_COMPONENT_ID_02': {
      id: 'PRODUCT_COMPONENT_ID_02',
      chainId: 'CHAIN_ID',
      name: { en: 'PRODUCT_COMP_NAME' },
      description: 'PRODUCT_COMP_DESC',
      allergens: [CrudApi.Allergen.egg, CrudApi.Allergen.fish],
      createdAt: 'CREATED_AT',
      updatedAt: 'UPDATED_AT',
    },
  };
  const prodComponentSetMap: ProductComponentSetMap = {
    'PROUDCT_SET_01': {
      id: 'PROUDCT_SET_01',
      chainId: 'CHAIN_ID',
      name: { en: 'PRODUCT_COMP_SET_NAME' },
      description: 'PRODUCT_COMP_SET_DESC',
      type: 'PRODUCT_COMP_SET_TYPE',
      maxSelection: 1,
      createdAt: 'CREATED_AT',
      updatedAt: 'UPDATED_AT',
      items: ['PRODUCT_COMPONENT_ID_01', 'PRODUCT_COMPONENT_ID_02'],
    },
  };
  const timezone01 = 'Europe/London';

  it('should return a minimal representation of the product in the correct format', () => {
    if (!baseProduct?.variants?.[0]) {
      throw new Error('wrong data');
    }

    const notActiveVariant: CrudApi.ProductVariant = {
      ...baseProduct.variants[0],
      availabilities: [
        {
          dayFrom: '2020-07-17',
          dayTo: '2020-07-19',
          price: 2,
          timeFrom: '00:00',
          timeTo: '23:59',
          type: EVariantAvailabilityType.SEASONAL,
        },
      ],
    };
    const anotherActiveVariant: CrudApi.ProductVariant = {
      ...baseProduct.variants[0],
      position: 100,
    };
    const product: Product = {
      ...baseProduct,
      variants: [
        baseProduct.variants[0],
        notActiveVariant,
        anotherActiveVariant,
      ],
      createdAt: '12',
      updatedAt: '13',
    };
    const result = calculateActualPricesAndCheckActivity({
      product,
      atTimeISO: new Date().toISOString(),
      inTimeZone: timezone01,
    });
    const activeVariantIdx = 0;

    if (!result) {
      throw 'CalculatedProduct is undefined';
    }

    expect(result).not.toBeUndefined();
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('image');
    expect(result).toHaveProperty('position', baseProduct.position);
    expect(result).toHaveProperty('tax', baseProduct.tax);
    expect(result).toHaveProperty('allergens');
    expect(result).toHaveProperty('configSets');
    // Variants
    expect(result).toHaveProperty('variants');
    expect(result.variants.length).toEqual(2);
    expect(result.variants[activeVariantIdx]).toHaveProperty('variantName');
    expect(result.variants[activeVariantIdx]).toHaveProperty('price');
    expect(result.variants[activeVariantIdx]).toHaveProperty(
      'position',
      product?.variants?.[activeVariantIdx]?.position,
    );
    expect(result?.variants?.[activeVariantIdx]).toHaveProperty('pack', {
      size: product?.variants?.[activeVariantIdx]?.pack?.size,
      unit: product?.variants?.[activeVariantIdx]?.pack?.unit,
    });
    // It still has availabilities because only the toCreateGeneratedProductInputType will remove it
    expect(result?.variants?.[activeVariantIdx]).toHaveProperty(
      'availabilities',
    );
    expect(result).toMatchSnapshot(
      `Result of calculateActualPricesAndCheckActivity with ONLY the variants with ACTIVE prices`,
    );
    expect(
      toCreateGeneratedProductInputType({
        product: result,
        unitId: baseProduct.unitId!,
        productConfigSets: result.configSets,
        productComponentSetMap: prodComponentSetMap,
        productComponentMap: prodComponentMap,
      }),
    ).toMatchSnapshot(`Result of toCreateGeneratedProductInputType`);
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

    // TODO fix this test, fails on unhandled null
    it('should return undefined in case the product is NOT visible', () => {
      expect(
        calculateActualPricesAndCheckActivity({
          product: { ...baseProduct, isVisible: false } as any,
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
        const variant: CrudApi.ProductVariant = {
          id: 'VAR_ID',
          variantName: { en: 'variantName' },
          pack: { size: 1, unit: 'unit' },
          isAvailable: true,
          price: 14,
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
      const variant: CrudApi.ProductVariant = {
        id: 'VAR_ID',
        variantName: { en: 'variantName' },
        price: 14,
        pack: { size: 1, unit: 'unit' },
        isAvailable: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        availabilities: [] as any,
        position: 1,
        refGroupPrice: 0,
      };
      const minimalProductWithSingleActiveVariant: Product = {
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
        chainId: 'foobar',
        createdAt: '1',
        updatedAt: '2',
        unitId: 'foobar',
      };

      it('should return undefined in case none of the variants have active availability', () => {
        const input = {
          ...minimalProductWithSingleActiveVariant,
        };
        expect(
          calculateActualPricesAndCheckActivity({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

        if (!input?.variants?.[0] || !input?.variants?.[1]) {
          throw new Error('Wrong data');
        }

        input.variants[0].availabilities = [
          {
            dayFrom: '',
            dayTo: '',
            price: 2.2,
            timeFrom: '',
            timeTo: '',
            type: EVariantAvailabilityType.ALWAYS,
          },
        ];

        input.variants[1].availabilities = [
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
          product: input,
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
