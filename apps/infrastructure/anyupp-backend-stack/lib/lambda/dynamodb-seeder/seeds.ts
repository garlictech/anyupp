// TODO: use some typing export const getUserSeed = (userId: string):Array<Partial<IUser>> => [
export const getUserSeed = (userId: string) => [
  {
    id: userId,
    stripeCustomerId: 'cus_IvqDUayMLk5RMa',
  },
  {
    id: 'fooo',
    stripeCustomerId: 'foo',
  },
  {
    id: 'barr',
    stripeCustomerId: 'bar',
  },
  {
    id: 'baz',
    stripeCustomerId: 'baz',
  },
];
export const getOrderSeed = () => [
  {
    id: 'order01',
    orderField: 'order01',
  },
  {
    id: 'order02',
    orderField: 'order02',
  },
];
export const getUnitSeed = () => [
  {
    id: 'UNIT_ID',
    groupId: 'GROUP_ID',
  },
];
export const getGroupSeed = () => [
  {
    id: 'GROUP_ID',
    currency: 'EUR',
  },
];
export const getUnitProductSeed = () => [
  {
    id: 'PROD_ID_01',
    name: {
      en: 'NAME_EN_01',
    },
    laneId: 'LANE_01',
  },
  {
    id: 'PROD_ID_02',
    name: {
      en: 'NAME_EN_02',
    },
    laneId: 'LANE_02',
  },
  {
    id: 'PROD_ID_03',
    name: {
      en: 'NAME_EN_03',
    },
  },
  {
    id: 'PROD_ID_04',
    name: {
      en: 'NAME_EN_04',
    },
    laneId: 'LANE_04',
  },
];
