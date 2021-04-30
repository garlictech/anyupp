/*
import { ProductcomponentsEntity } from './productcomponents.models';
import * as ProductcomponentsActions from './productcomponents.actions';
import { State, initialState, reducer } from './productcomponents.reducer';

describe('Productcomponents Reducer', () => {
  const createProductcomponentsEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as ProductcomponentsEntity);

  beforeEach(() => {});

  describe('valid Productcomponents actions', () => {
    it('loadProductcomponentsSuccess should return set the list of known Productcomponents', () => {
      const productcomponents = [
        createProductcomponentsEntity('PRODUCT-AAA'),
        createProductcomponentsEntity('PRODUCT-zzz'),
      ];
      const action = ProductcomponentsActions.loadProductcomponentsSuccess({
        productcomponents,
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
*/
