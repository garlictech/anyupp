/*
import { ProductComponentSetsEntity } from './product-component-sets.models';
import {
  State,
  productComponentSetsAdapter,
  initialState,
} from './product-component-sets.reducer';
import * as ProductComponentSetsSelectors from './product-component-sets.selectors';

describe('ProductComponentSets Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getProductComponentSetsId = it => it['id'];
  const createProductComponentSetsEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as ProductComponentSetsEntity);

  let state;

  beforeEach(() => {
    state = {
      productComponentSets: productComponentSetsAdapter.setAll(
        [
          createProductComponentSetsEntity('PRODUCT-AAA'),
          createProductComponentSetsEntity('PRODUCT-BBB'),
          createProductComponentSetsEntity('PRODUCT-CCC'),
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

  describe('ProductComponentSets Selectors', () => {
    it('getAllProductComponentSets() should return the list of ProductComponentSets', () => {
      const results = ProductComponentSetsSelectors.getAllProductComponentSets(
        state,
      );
      const selId = getProductComponentSetsId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = ProductComponentSetsSelectors.getSelected(state);
      const selId = getProductComponentSetsId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getProductComponentSetsLoaded() should return the current 'loaded' status", () => {
      const result = ProductComponentSetsSelectors.getProductComponentSetsLoaded(
        state,
      );

      expect(result).toBe(true);
    });

    it("getProductComponentSetsError() should return the current 'error' state", () => {
      const result = ProductComponentSetsSelectors.getProductComponentSetsError(
        state,
      );

      expect(result).toBe(ERROR_MSG);
    });
  });
});
*/
