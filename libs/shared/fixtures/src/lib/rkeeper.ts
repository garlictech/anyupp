import { OrderMode, PosType, ServingMode } from '@bgap/domain';
import * as unitFixture from './unit';
import { RequiredId } from '@bgap/shared/types';
import { CreateUnitInput } from '@bgap/domain';

export const freiUnitId = 'frei-rkeeper-unit';
export const freiRestaurantId = '109150001';
export const rkeeperEndpoint = `https://testendpoint.ucs.hu/wp-json/vendor/v1`;
export const freiRkeeperUsername = '590_49_985_540';
export const freiRkeeperPassword = 'f3e7c8260b2f9b1cc62208a441410a';
export const freiRkeeperWaiterProductId = '1040917';

export const createRkeeperUnit: RequiredId<CreateUnitInput> = {
  ...unitFixture.unitBase,
  id: 'rkeeper-unit',
  currency: 'HUF',
  externalId: 'restaurantid',
  floorMap: unitFixture.floorMap,
  pos: {
    type: PosType.rkeeper,
    rkeeper: {
      // let's use the yellow real rkeeper endpoint
      endpointUri: rkeeperEndpoint,
      rkeeperUsername: freiRkeeperUsername,
      rkeeperPassword: freiRkeeperPassword,
      anyuppUsername: 'ANYUPP_USERNAME',
      anyuppPassword: 'ANYUPP_PASSWORD',
    },
  },
};

export const freiUnit = {
  ...createRkeeperUnit,
  id: freiUnitId,
  name: `frei RKEEPER unit`,
  supportedOrderModes: [OrderMode.pickup, OrderMode.instant],
  supportedServingModes: [ServingMode.takeaway, ServingMode.inplace],
  externalId: '109150001',
  canCallWaiter: true,
  pos: {
    type: PosType.rkeeper,
    rkeeper: {
      endpointUri: 'https://testendpoint.ucs.hu/wp-json/vendor/v1',
      rkeeperUsername: freiRkeeperUsername,
      rkeeperPassword: freiRkeeperPassword,
      anyuppPassword: 'foobar',
      anyuppUsername: 'foobar',
    },
  },
};
