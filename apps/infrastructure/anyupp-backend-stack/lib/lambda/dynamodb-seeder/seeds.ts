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
