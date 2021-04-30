/*
import { ProductcomponentsEntity } from './productcomponents.models';
import {
  State,
  productcomponentsAdapter,
  initialState,
} from './productcomponents.reducer';
import * as ProductcomponentsSelectors from './productcomponents.selectors';

describe('Productcomponents Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getProductcomponentsId = it => it['id'];
  const createProductcomponentsEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as ProductcomponentsEntity);

  let state;

  beforeEach(() => {
    state = {
      productcomponents: productcomponentsAdapter.setAll(
        [
          createProductcomponentsEntity('PRODUCT-AAA'),
          createProductcomponentsEntity('PRODUCT-BBB'),
          createProductcomponentsEntity('PRODUCT-CCC'),
        ],
        {
          ...initialState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        },
      ),
    };
  });

  describe('Productcomponents Selectors', () => {
    it('getAllProductcomponents() should return the list of Productcomponents', () => {
      const results = ProductcomponentsSelectors.getAllProductcomponents(state);
      const selId = getProductcomponentsId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = ProductcomponentsSelectors.getSelected(state);
      const selId = getProductcomponentsId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getProductcomponentsLoaded() should return the current 'loaded' status", () => {
      const result = ProductcomponentsSelectors.getProductcomponentsLoaded(
        state,
      );

      expect(result).toBe(true);
    });

    it("getProductcomponentsError() should return the current 'error' state", () => {
      const result = ProductcomponentsSelectors.getProductcomponentsError(
        state,
      );

      expect(result).toBe(ERROR_MSG);
    });
  });
});
*/