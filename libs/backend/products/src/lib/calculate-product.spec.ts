/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  defaultSupportedServingModes,
  EVariantAvailabilityType,
  ProductComponentMap,
  ProductComponentSetMap,
} from '@bgap/shared/types';
import {
  Allergen,
  ProductComponentSetType,
  ProductType,
  Variant,
  ServingMode,
  UnitProduct,
} from '@bgap/domain';
import {
  calculateActualPricesAndCheckActivity,
  toCreateProductInputType,
} from './calculate-product';

describe('calculatePricesAndCheckActivity method', () => {
  const baseProduct: UnitProduct = {
    id: 'PRODUCT_ID',
    unitId: 'UNIT_ID',
    takeaway: true,
    tax: 11,
    takeawayTax: 23,
    name: { en: 'NAME' },
    description: { en: 'DESCRIPTION' },
    image: 'IMG',
    createdAt: 'CREATED_AT',
    updatedAt: 'UPDATED_AT',
    productCategoryId: 'PROD_CAT_ID',
    productType: ProductType.drink,
    position: 1,
    isVisible: true,
    allergens: [Allergen.peanut, Allergen.egg],
    supportedServingModes: [ServingMode.inplace, ServingMode.takeaway],
    variants: {
      items: [
        {
          id: `VARIANT_ID_01`,
          variantName: { en: `VARIANT_NAME_01` },
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
          soldOut: false,
          netPackagingFee: 30,
          createdAt: 'CREATEDAT',
          updatedAt: 'UPDATEDAT',
        },
      ],
    },
    configSets: [
      {
        productSetId: 'PRODUCT_SET_01',
        items: [
          {
            productComponentId: 'PRODUCT_COMPONENT_ID_11',
            price: 1,
            position: 1,
            netPackagingFee: 30,
          },
          {
            productComponentId: 'PRODUCT_COMPONENT_ID_21',
            price: 2,
            position: 2,
            netPackagingFee: 40,
          },
        ],
        position: 1,
      },
    ],
  };
  const prodComponentMap: ProductComponentMap = {
    PRODUCT_COMPONENT_ID_11: {
      id: 'PRODUCT_COMPONENT_ID_11',
      ownerEntity: 'UNIT_ID',
      name: { en: 'PRODUCT_COMP_NAME' },
      description: 'PRODUCT_COMP_DESC',
      allergens: [Allergen.egg, Allergen.fish],
      createdAt: 'CREATED_AT',
      updatedAt: 'UPDATED_AT',
      externalId: 'EXTERNAL_ID',
      dirty: false,
      deletedAt: '',
    },
    PRODUCT_COMPONENT_ID_21: {
      id: 'PRODUCT_COMPONENT_ID_21',
      ownerEntity: 'UNIT_ID',
      name: { en: 'PRODUCT_COMP_NAME' },
      description: 'PRODUCT_COMP_DESC',
      allergens: [Allergen.egg, Allergen.fish],
      createdAt: 'CREATED_AT',
      updatedAt: 'UPDATED_AT',
      externalId: 'EXTERNAL_ID',
      dirty: false,
      deletedAt: '',
    },
  };
  const prodComponentSetMap: ProductComponentSetMap = {
    PRODUCT_SET_01: {
      id: 'PRODUCT_SET_01',
      ownerEntity: 'UNIT_ID',
      name: { en: 'PRODUCT_COMP_SET_NAME' },
      description: 'PRODUCT_COMP_SET_DESC',
      maxSelection: 1,
      createdAt: 'CREATED_AT',
      updatedAt: 'UPDATED_AT',
      supportedServingModes: defaultSupportedServingModes,
      items: ['PRODUCT_COMPONENT_ID_11', 'PRODUCT_COMPONENT_ID_21'],
      externalId: 'EXTERNAL_ID',
      dirty: false,
      deletedAt: '',
      type: ProductComponentSetType.extras,
    },
  };
  const timezone01 = 'Europe/London';

  it('should return a minimal representation of the product in the correct format', () => {
    if (!baseProduct?.variants?.items?.[0]) {
      throw new Error('wrong data');
    }

    const notActiveVariant: Variant = {
      ...baseProduct.variants.items[0],
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
    const anotherActiveVariant: Variant = {
      ...baseProduct.variants.items[0],
      position: 100,
    };
    const product: UnitProduct = {
      ...baseProduct,
      variants: {
        items: [
          baseProduct.variants.items[0],
          notActiveVariant,
          anotherActiveVariant,
        ],
      },
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
      product?.variants?.items[activeVariantIdx]?.position,
    );
    expect(result.variants?.[activeVariantIdx]).toHaveProperty('pack', {
      size: product?.variants?.items[activeVariantIdx]?.pack?.size,
      unit: product?.variants?.items[activeVariantIdx]?.pack?.unit,
    });
    // It still has availabilities because only the toCreateProductInputType will remove it
    expect(result?.variants?.[activeVariantIdx]).toHaveProperty(
      'availabilities',
    );
    expect(result).toMatchSnapshot(
      `Result of calculateActualPricesAndCheckActivity with ONLY the variants with ACTIVE prices`,
    );
    expect(
      toCreateProductInputType({
        product: result,
        unitId: baseProduct.unitId,
        productConfigSets: result.configSets,
        productComponentSetMap: prodComponentSetMap,
        productComponentMap: prodComponentMap,
      }),
    ).toMatchSnapshot(`Result of toCreateProductInputType`);
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
        const variant: Variant = {
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
          createdAt: 'CREATEDAT',
          updatedAt: 'UPDATEDAT',
        };
        const input = {
          ...baseProduct,
          variants: {
            items: [variant, { ...variant, position: 2, isAvailable: false }],
          },
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
      const variant: Variant = {
        id: 'VAR_ID',
        variantName: { en: 'variantName' },
        price: 14,
        pack: { size: 1, unit: 'unit' },
        isAvailable: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        availabilities: [] as any,
        position: 1,
        createdAt: 'CREATEDAT',
        updatedAt: 'UPDATEDAT',
      };
      const minimalProductWithSingleActiveVariant: Partial<UnitProduct> = {
        id: 'PROD_ID',
        isVisible: true,
        name: { en: 'prodName' },
        productCategoryId: 'productCategoryId',
        productType: ProductType.drink,
        description: { en: 'desc' },
        image: 'image',
        tax: 0,
        position: 2,
        variants: { items: [{ ...variant }, { ...variant }] },
        unitId: 'foobar',
        createdAt: '1',
        updatedAt: '2',
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

        if (!input?.variants?.items[0] || !input?.variants?.items[1]) {
          throw new Error('Wrong data');
        }

        input.variants.items[0].availabilities = [
          {
            dayFrom: '',
            dayTo: '',
            price: 2.2,
            timeFrom: '',
            timeTo: '',
            type: EVariantAvailabilityType.ALWAYS,
          },
        ];

        input.variants.items[1].availabilities = [
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
