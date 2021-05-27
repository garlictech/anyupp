/* eslint-disable @typescript-eslint/no-explicit-any */

import { mergeAllProductLayers } from './merge-product';
import { productSeed } from '@bgap/shared/fixtures';

describe('Merge product layers', () => {
  const cpb = productSeed.chainProductBase;
  const gpb = productSeed.groupProductBase;
  const upb = productSeed.unitProductBase;
  // it("should be successfull in case only unitProduct exists", () => {
  //     expect(() => mergeAllProductLayers({ unitProduct: {} as any })).not.toThrow();
  // });

  describe('isVisible', () => {
    // TODO fix this test
    it('should be true if every product is visible', () => {
      const chainProduct: any = { ...cpb, isVisible: true };
      const groupProduct: any = { ...gpb, isVisible: true };
      const unitProduct: any = { ...upb, isVisible: true };
      expect(
        mergeAllProductLayers({ chainProduct, groupProduct, unitProduct }),
      ).toHaveProperty('isVisible', true);
    });

    // TODO fix this test
    it('should be FALSE if any product is NOT visible', () => {
      expect(
        mergeAllProductLayers({
          chainProduct: { ...cpb, isVisible: true } as any,
          groupProduct: { ...gpb, isVisible: true } as any,
          unitProduct: { ...upb, isVisible: false } as any,
        }),
      ).toHaveProperty('isVisible', false);
      expect(
        mergeAllProductLayers({
          chainProduct: { ...cpb, isVisible: true } as any,
          groupProduct: { ...gpb, isVisible: false } as any,
          unitProduct: { ...upb, isVisible: true } as any,
        }),
      ).toHaveProperty('isVisible', false);
      expect(
        mergeAllProductLayers({
          chainProduct: { ...cpb, isVisible: false } as any,
          groupProduct: { ...gpb, isVisible: true } as any,
          unitProduct: { ...upb, isVisible: true } as any,
        }),
      ).toHaveProperty('isVisible', false);
    });

    // it("should be calculated in case any product is missing", () => {
    //     expect(mergeAllProductLayers({ unitProduct: { isVisible: true } as any })).toHaveProperty("isVisible");
    // });
  });

  describe('Variants', () => {
    it('should contains all the group and unit variants', () => {
      const mergedProduct = mergeAllProductLayers({
        chainProduct: {} as any,
        groupProduct: { variants: [{ id: 1 }, { id: 2 }, { id: 3 }] } as any,
        unitProduct: { variants: [{ id: 3 }, { id: 4 }] } as any,
      });

      const variantIds = mergedProduct?.variants?.map(x => x?.id);
      expect(variantIds).toEqual([1, 2, 3, 4]);
    });

    describe('variant merging', () => {
      it('should merge each variants', () => {
        const mergedProduct = mergeAllProductLayers({
          chainProduct: {} as any,

          groupProduct: {
            variants: [
              { id: 1, isAvailable: true },
              { id: 2, isAvailable: true },
              { id: 3, isAvailable: true },
            ],
          } as any,
          unitProduct: {
            variants: [
              { id: 2, variantName: 'variantName' },
              { id: 3, variantName: 'variantName' },
              { id: 4, variantName: 'variantName' },
            ],
          } as any,
        });
        expect(mergedProduct.variants).toMatchInlineSnapshot(`
                     Array [
                       Object {
                         "id": 1,
                         "isAvailable": true,
                       },
                       Object {
                         "id": 2,
                         "isAvailable": true,
                         "variantName": "variantName",
                       },
                       Object {
                         "id": 3,
                         "isAvailable": true,
                         "variantName": "variantName",
                       },
                       Object {
                         "id": 4,
                         "isAvailable": true,
                         "variantName": "variantName",
                       },
                     ]
                `);
      });

      describe('isAvailable', () => {
        it('should be calculated with AND', () => {
          const mergedProduct = mergeAllProductLayers({
            chainProduct: {} as any,

            groupProduct: {
              variants: [
                { id: 1, isAvailable: true },
                { id: 2, isAvailable: true },
                { id: 3, isAvailable: false },
                { id: 4, isAvailable: false },
                { id: 5, isAvailable: false },
                // 6 is missing
                { id: 7, isAvailable: true },
                // 8 is missing
              ],
            } as any,
            unitProduct: {
              variants: [
                { id: 1, isAvailable: true },
                { id: 2, isAvailable: false },
                { id: 3, isAvailable: true },
                { id: 4, isAvailable: false },
                // 5 is missing
                { id: 6, isAvailable: false },
                // 7 is missing
                { id: 8, isAvailable: true },
              ],
            } as any,
          });

          const expectedValues: { [key: string]: boolean } = {
            // id: availability
            1: true, //  true && true
            2: false, // true && false
            3: false, // false && true
            4: false, // false && false
            5: false, // false && undefined
            6: false, // undefined && false
            7: true, //  true && undefined
            8: true, //  undefined && true
          };

          expect(mergedProduct?.variants?.length).toEqual(8);
          mergedProduct?.variants?.map(variant => {
            if (!variant) {
              throw new Error('wrong data');
            }
            // DEBUG helper console.log
            // console.log(
            //   `id:${variant.id} | ${variant.isAvailable}=?=${
            //     expectedValues[variant.id]
            //   }`,
            // );
            expect(variant).toHaveProperty(
              'isAvailable',
              expectedValues[variant.id],
            );
          });
        });
      });
    });
  });
});
