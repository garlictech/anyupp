import { ProductCategoriesEntity } from './product-categories.models';
import * as ProductCategoriesActions from './product-categories.actions';
import { State, initialState, reducer } from './product-categories.reducer';

describe('ProductCategories Reducer', () => {
  const createProductCategoriesEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as ProductCategoriesEntity);

  beforeEach(() => {});

  describe('valid ProductCategories actions', () => {
    it('loadProductCategoriesSuccess should return set the list of known ProductCategories', () => {
      const productCategories = [
        createProductCategoriesEntity('PRODUCT-AAA'),
        createProductCategoriesEntity('PRODUCT-zzz'),
      ];
      const action = ProductCategoriesActions.loadProductCategoriesSuccess({
        productCategories,
      });

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
