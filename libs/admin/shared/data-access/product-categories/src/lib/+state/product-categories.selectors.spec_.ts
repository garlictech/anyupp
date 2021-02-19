/*
import {
  productCategoriesAdapter,
  initialState,
} from './product-categories.reducer';
import * as ProductCategoriesSelectors from './product-categories.selectors';

xdescribe('ProductCategories Selectors', () => {

  const ERROR_MSG = 'No Error Available';
  const getProductCategoriesId = it => it['id'];
  const createProductCategoriesEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as ProductCategoriesEntity);

  let state;

  beforeEach(() => {
    state = {
      productCategories: productCategoriesAdapter.setAll(
        [
          createProductCategoriesEntity('PRODUCT-AAA'),
          createProductCategoriesEntity('PRODUCT-BBB'),
          createProductCategoriesEntity('PRODUCT-CCC'),
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

  xdescribe('ProductCategories Selectors', () => {
    it('getAllProductCategories() should return the list of ProductCategories', () => {
      const results = ProductCategoriesSelectors.getAllProductCategories(state);
      const selId = getProductCategoriesId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = ProductCategoriesSelectors.getSelected(state);
      const selId = getProductCategoriesId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getProductCategoriesLoaded() should return the current 'loaded' status", () => {
      const result = ProductCategoriesSelectors.getProductCategoriesLoaded(
        state
      );

      expect(result).toBe(true);
    });

    it("getProductCategoriesError() should return the current 'error' state", () => {
      const result = ProductCategoriesSelectors.getProductCategoriesError(
        state
      );

      expect(result).toBe(ERROR_MSG);
    });
  });

});
*/
