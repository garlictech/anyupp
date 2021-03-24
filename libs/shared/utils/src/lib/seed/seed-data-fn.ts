import { pipe } from 'fp-ts/lib/function';
import { from, throwError } from 'rxjs';

import API, { graphqlOperation } from '@aws-amplify/api-graphql';
import { EPaymentMethod, EProductType } from '@bgap/shared/types';
import {
  AmplifyApi,
  AmplifyApiMutationDocuments,
} from '@bgap/admin/amplify-api';

const generateChainId = (idx: number) => `chain_${idx}_id`;
const generateGroupId = (chainIdx: number, idx: number) =>
  `group_c${chainIdx}_${idx}_id`;
const generateUnitId = (chainIdx: number, groupIdx: number, idx: number) =>
  `unit_c${chainIdx}_g${groupIdx}_${idx}_id`;
const generateLaneId = (
  chainIdx: number,
  groupIdx: number,
  unitIdx: number,
  idx: number,
) => `lane_c${chainIdx}_g${groupIdx}_u${unitIdx}_${idx}_id`;
const generateProductCategoryId = (chainIdx: number, idx: number) =>
  `product_category_c${chainIdx}_${idx}_id`;
const generateChainProductId = (chainIdx: number, idx: number) =>
  `chain_product_c${chainIdx}_${idx}_id`;
const generateGroupProductId = (
  chainIdx: number,
  groupIdx: number,
  idx: number,
) => `group_product_c${chainIdx}_g${groupIdx}_${idx}_id`;
const generateUnitProductId = (
  chainIdx: number,
  groupIdx: number,
  idx: number,
) => `unit_product_c${chainIdx}_g${groupIdx}_${idx}_id`;
const generateVariantId = (chainIdx: number, productId: number, idx: number) =>
  `chain_product_variant_c${chainIdx}_p${productId}_${idx}_id`;
const generateCartId = (idx: number) => `cart_${idx}_id`;
const generateUserId = (idx: number) => `user_${idx}_id`;

export const createTestChain = (chainIdx: number) =>
  pipe(
    API.graphql(
      graphqlOperation(AmplifyApiMutationDocuments.createChain, {
        input: {
          id: generateChainId(chainIdx),
          name: `Test chain #${chainIdx}`,
          description: {
            hu: `Teszt lánc #${chainIdx} leírás`,
            en: `Test chain #${chainIdx} description`,
          },
          isActive: true,
          email: `info@chain${chainIdx}.com`,
          phone: '1234567890',
        },
      }),
    ),
    operation =>
      operation instanceof Promise
        ? from(operation)
        : throwError('Wrong graphql operation'),
  );

export const createTestGroup = (chainIdx: number, groupIdx: number) =>
  pipe(
    API.graphql(
      graphqlOperation(AmplifyApiMutationDocuments.createGroup, {
        input: {
          id: generateGroupId(chainIdx, groupIdx),
          chainId: generateChainId(chainIdx),
          name: `Test group #${groupIdx}`,
          description: {
            hu: `Teszt group #${groupIdx} leírás`,
            en: `Test group #${groupIdx} description`,
          },
          currency: groupIdx % 2 === 0 ? 'HUF' : 'EUR',
        },
      }),
    ),
    operation =>
      operation instanceof Promise
        ? from(operation)
        : throwError('Wrong graphql operation'),
  );

export const createTestUnit = (
  chainIdx: number,
  groupIdx: number,
  unitIdx: number,
) =>
  pipe(
    API.graphql(
      graphqlOperation(AmplifyApiMutationDocuments.createUnit, {
        input: {
          id: generateUnitId(chainIdx, groupIdx, unitIdx),
          groupId: generateGroupId(chainIdx, groupIdx),
          chainId: generateChainId(chainIdx),
          isActive: true,
          isAcceptingOrders: true,
          name: `Test unit #${unitIdx}`,
          description: {
            hu: `Teszt unit #${unitIdx} leírás`,
            en: `Test unit #${unitIdx} description`,
          },
          paymentModes: [
            {
              method: 'CASH',
              name: 'Cash',
            },
            {
              method: 'CARD',
              name: 'Card',
            },
            {
              method: 'INAPP',
              name: 'Stripe',
            },
          ],
          lanes: [
            {
              color: '#e72222',
              id: generateLaneId(chainIdx, groupIdx, unitIdx, 1),
              name: 'bár',
            },
            {
              color: '#e123ef',
              id: generateLaneId(chainIdx, groupIdx, unitIdx, 2),
              name: 'konyha',
            },
          ],
          open: {
            from: '08:00',
            to: '18:00',
          },
        },
      }),
    ),
    operation =>
      operation instanceof Promise
        ? from(operation)
        : throwError('Wrong graphql operation'),
  );

export const createTestProductCategory = (
  chainIdx: number,
  productCategoryId: number,
) =>
  pipe(
    API.graphql(
      graphqlOperation(AmplifyApiMutationDocuments.createProductCategory, {
        input: {
          id: generateProductCategoryId(chainIdx, productCategoryId),
          chainId: generateChainId(chainIdx),
          name: {
            hu: `Teszt termék kategória #${productCategoryId} név`,
            en: `Test product category #${productCategoryId} name`,
          },
          description: {
            hu: `Teszt product kategória #${productCategoryId} leírás`,
            en: `Test product category #${productCategoryId} description`,
          },
          position: productCategoryId.toString(),
        },
      }),
    ),
    operation =>
      operation instanceof Promise
        ? from(operation)
        : throwError('Wrong graphql operation'),
  );

export const createTestChainProduct = (
  chainIdx: number,
  productCategoryIdx: number,
  productIdx: number,
) =>
  pipe(
    API.graphql(
      graphqlOperation(AmplifyApiMutationDocuments.createChainProduct, {
        input: {
          id: generateChainProductId(chainIdx, productIdx),
          chainId: generateChainId(chainIdx),
          name: {
            hu: `Teszt chain termék #${productIdx} név`,
            en: `Test chain product #${productIdx} name`,
          },
          description: {
            hu: `Teszt chain termék #${productIdx} leírás`,
            en: `Test chain termék #${productIdx} description`,
          },
          productCategoryId: generateProductCategoryId(
            chainIdx,
            productCategoryIdx,
          ),
          productType:
            productIdx % 2 === 0 ? EProductType.FOOD : EProductType.DRINK,
          isVisible: true,
          variants: [
            {
              id: generateVariantId(chainIdx, productIdx, 1),
              isAvailable: true,
              pack: {
                size: 2,
                unit: 'dl',
              },
              variantName: {
                en: 'glass',
                hu: 'pohár',
              },
            },
          ],
        },
      }),
    ),
    operation =>
      operation instanceof Promise
        ? from(operation)
        : throwError('Wrong graphql operation'),
  );

export const createTestGroupProduct = (
  chainIdx: number,
  groupIdx: number,
  chainProductIdx: number,
  productIdx: number,
) =>
  pipe(
    API.graphql(
      graphqlOperation(AmplifyApiMutationDocuments.createGroupProduct, {
        input: {
          id: generateGroupProductId(chainIdx, groupIdx, productIdx),
          parentId: generateChainProductId(chainIdx, chainProductIdx),
          chainId: generateChainId(chainIdx),
          groupId: generateGroupId(chainIdx, groupIdx),
          isVisible: true,
          tax: 27,
          variants: [
            {
              id: generateVariantId(chainIdx, productIdx, 1),
              isAvailable: true,
              pack: {
                size: 2,
                unit: 'dl',
              },
              variantName: {
                en: 'glass',
                hu: 'pohár',
              },
              refGroupPrice: productIdx * 50,
            },
          ],
        },
      }),
    ),
    operation =>
      operation instanceof Promise
        ? from(operation)
        : throwError('Wrong graphql operation'),
  );

export const createTestUnitProduct = (
  chainIdx: number,
  groupIdx: number,
  unitIdx: number,
  groupProductIdx: number,
  productIdx: number,
) =>
  pipe(
    API.graphql(
      graphqlOperation(AmplifyApiMutationDocuments.createUnitProduct, {
        input: {
          id: generateUnitProductId(chainIdx, groupIdx, productIdx),
          parentId: generateGroupProductId(chainIdx, groupIdx, groupProductIdx),
          chainId: generateChainId(chainIdx),
          groupId: generateGroupId(chainIdx, groupIdx),
          unitId: generateUnitId(chainIdx, groupIdx, unitIdx),
          laneId: generateLaneId(chainIdx, groupIdx, unitIdx, 1),
          isVisible: true,
          takeaway: false,
          variants: [
            {
              id: generateVariantId(chainIdx, productIdx, 1),
              isAvailable: true,
              pack: {
                size: 2,
                unit: 'dl',
              },
              variantName: {
                en: 'glass',
                hu: 'pohár',
              },
              availabilities: [
                {
                  dayFrom: '',
                  dayTo: '',
                  price: productIdx * 60,
                  timeFrom: '',
                  timeTo: '',
                  type: 'A',
                },
              ],
            },
          ],
        },
      }),
    ),
    operation =>
      operation instanceof Promise
        ? from(operation)
        : throwError('Wrong graphql operation'),
  );

export const createTestCart = ({
  chainIdx,
  groupIdx,
  unitIdx,
  productIdx,
  userIdx,
  cartIdx,
}: {
  chainIdx: number;
  groupIdx: number;
  unitIdx: number;
  productIdx: number;
  userIdx: number;
  cartIdx: number;
}) =>
  pipe(
    API.graphql(
      graphqlOperation(AmplifyApiMutationDocuments.createCart, {
        input: {
          id: generateCartId(cartIdx),
          userId: generateUserId(userIdx),
          unitId: generateUnitId(chainIdx, groupIdx, unitIdx),
          paymentMethod: EPaymentMethod.INAPP,
          items: [
            {
              productName: {
                en: 'Water',
                hu: 'Viz',
              },
              priceShown: {
                currency: 'EUR',
                pricePerUnit: 1,
                priceSum: 2,
              },
              productId: generateUnitProductId(chainIdx, groupIdx, productIdx),
              quantity: 2,
              variantId: generateVariantId(chainIdx, productIdx, 1),
              variantName: {
                en: 'glass',
                hu: 'pohár',
              },
              laneId: generateLaneId(chainIdx, groupIdx, unitIdx, 1),
            } as AmplifyApi.OrderItemInput,
          ],
        } as AmplifyApi.CreateCartInput,
      }),
    ),
    operation =>
      operation instanceof Promise
        ? from(operation)
        : throwError('Wrong graphql operation'),
  );
