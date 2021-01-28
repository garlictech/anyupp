import { State, ordersAdapter, initialState } from './orders.reducer';
import * as OrdersSelectors from './orders.selectors';

describe('Orders Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getOrdersId = it => it['id'];
  const createOrdersEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as OrdersEntity);

  let state;

  beforeEach(() => {
    state = {
      orders: ordersAdapter.setAll(
        [
          createOrdersEntity('PRODUCT-AAA'),
          createOrdersEntity('PRODUCT-BBB'),
          createOrdersEntity('PRODUCT-CCC'),
        ],
        {
          ...initialState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('Orders Selectors', () => {
    it('getAllOrders() should return the list of Orders', () => {
      const results = OrdersSelectors.getAllOrders(state);
      const selId = getOrdersId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = OrdersSelectors.getSelected(state);
      const selId = getOrdersId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getOrdersLoaded() should return the current 'loaded' status", () => {
      const result = OrdersSelectors.getOrdersLoaded(state);

      expect(result).toBe(true);
    });

    it("getOrdersError() should return the current 'error' state", () => {
      const result = OrdersSelectors.getOrdersError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
