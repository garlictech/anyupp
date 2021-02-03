/*
describe('Orders Reducer', () => {
  const createOrdersEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as OrdersEntity);

  beforeEach(() => {});

  describe('valid Orders actions', () => {
    it('loadOrdersSuccess should return set the list of known Orders', () => {
      const orders = [
        createOrdersEntity('PRODUCT-AAA'),
        createOrdersEntity('PRODUCT-zzz'),
      ];
      const action = OrdersActions.loadOrdersSuccess({ orders });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
*/