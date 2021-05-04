/*
import { ProductComponentSetsEntity } from './product-component-sets.models';
import * as ProductComponentSetsActions from './product-component-sets.actions';
import { State, initialState, reducer } from './product-component-sets.reducer';

describe('ProductComponentSets Reducer', () => {
  const createProductComponentSetsEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as ProductComponentSetsEntity);

  beforeEach(() => {});

  describe('valid ProductComponentSets actions', () => {
    it('loadProductComponentSetsSuccess should return set the list of known ProductComponentSets', () => {
      const productComponentSets = [
        createProductComponentSetsEntity('PRODUCT-AAA'),
        createProductComponentSetsEntity('PRODUCT-zzz'),
      ];
      const action = ProductComponentSetsActions.loadProductComponentSetsSuccess(
        { productComponentSets },
      );

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