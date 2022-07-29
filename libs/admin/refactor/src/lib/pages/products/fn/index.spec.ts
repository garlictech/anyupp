import {
  CreateUnitProductInput,
  ProductComponentSetType,
} from '@bgap/domain';
import { handleEmptyPackaginFees } from './index';

test('handleEmptyPackaginFees', () => {
  const input: CreateUnitProductInput = {
    isVisible: true,
    variants: [
      {
        id: 'd22dee40-528b-11ec-afe3-15e1afd659e2',
        variantName: {
          hu: 'normál',
          en: 'normal',
          de: 'normal',
        },
        pack: {
          size: 1,
          unit: 'db',
        },
        isAvailable: true,
        availabilities: [
          {
            type: 'A',
            dayFrom: '',
            dayTo: '',
            timeFrom: '',
            timeTo: '',
            price: 1200,
          },
        ],
        position: 0,
        price: 0,
        netPackagingFee: 1200,
      },
      {
        id: 'de590330-528b-11ec-afe3-15e1afd659e2',
        variantName: {
          hu: 'dupla',
          en: 'double',
          de: 'double',
        },
        pack: {
          size: 1,
          unit: 'db',
        },
        isAvailable: true,
        availabilities: [
          {
            type: 'A',
            dayFrom: '',
            dayTo: '',
            timeFrom: '',
            timeTo: '',
            price: 1500,
          },
        ],
        position: 0,
        price: 0,
        netPackagingFee: undefined,
      },
    ],
    configSets: [
      {
        productSetId: 'seeded_product_component_set_03_id',
        items: [
          {
            productComponentId: 'seeded_product_component_31_id',
            position: 1,
            price: 500,
            netPackagingFee: 11,
            name: { en: 'NAME' },
          },
          {
            productComponentId: 'seeded_product_component_32_id',
            position: 2,
            price: 500,
            netPackagingFee: undefined,
            name: { en: 'NAME' },
          },
          {
            productComponentId: 'seeded_product_component_33_id',
            position: 3,
            price: 500,
            netPackagingFee: undefined,
            name: { en: 'NAME' },
          },
        ],
        position: 1,
        name: { en: 'NAME' },
        type: ProductComponentSetType.modifier,
      },
    ],
    laneId: 'lane_01',
    supportedServingModes: [],
    id: 'seeded_unit_product_c1_g1_u1_9_id',
    takeaway: true,
  };

  expect(handleEmptyPackaginFees(input)).toMatchSnapshot();
});
