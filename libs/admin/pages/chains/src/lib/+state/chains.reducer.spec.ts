import { ChainsEntity } from './chains.models';
import * as ChainsActions from './chains.actions';
import { State, initialState, reducer } from './chains.reducer';

describe('Chains Reducer', () => {
  const createChainsEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as ChainsEntity);

  beforeEach(() => {});

  describe('valid Chains actions', () => {
    it('loadChainsSuccess should return set the list of known Chains', () => {
      const chains = [
        createChainsEntity('PRODUCT-AAA'),
        createChainsEntity('PRODUCT-zzz'),
      ];
      const action = ChainsActions.loadChainsSuccess({ chains });

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
